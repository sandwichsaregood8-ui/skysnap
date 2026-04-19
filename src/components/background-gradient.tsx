"use client"

import { useEffect, useRef } from 'react';

export function BackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error("WebGL not supported");
        return;
    }

    const vertexSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    // The user wants a sine wave with static and dynamic properties.
    // I will combine a main, slow-moving sine wave with faster, smaller waves
    // and use FBM noise to create a textured, atmospheric effect.
    const fragmentSource = `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;

        // FBM noise function to add texture
        float random (in vec2 _st) {
            return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float noise (in vec2 _st) {
            vec2 i = floor(_st);
            vec2 f = fract(_st);
            vec2 u = f*f*(3.0-2.0*f);
            return mix(mix(random(i + vec2(0.0,0.0)), random(i + vec2(1.0,0.0)), u.x),
                        mix(random(i + vec2(0.0,1.0)), random(i + vec2(1.0,1.0)), u.x), u.y);
        }

        #define NUM_OCTAVES 5
        float fbm ( in vec2 _st) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100.0);
            mat2 rot = mat2(cos(0.5), sin(0.5),
                            -sin(0.5), cos(0.50));
            for (int i = 0; i < NUM_OCTAVES; ++i) {
                v += a * noise(_st);
                _st = rot * _st * 2.0 + shift;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy/u_resolution.xy;
            float aspect = u_resolution.x / u_resolution.y;
            uv.x *= aspect;

            float time = u_time * 0.2;

            // Static component: A wider, gentle sine wave shaping the background
            float static_wave = sin(uv.y * 1.0 + 1.5) * 0.3;

            // Dynamic component: Wider, faster moving, smaller waves for shimmer
            float dynamic_wave1 = sin(uv.x * 5.0 + time) * 0.03;
            float dynamic_wave2 = cos(uv.y * 7.0 - time * 1.5) * 0.02;

            // Combine the waves to distort the y-coordinate
            float final_y = uv.y + static_wave + dynamic_wave1 + dynamic_wave2;

            // Use noise for a smoky/aurora texture, animated over time
            vec2 noise_coord = vec2(uv.x * 1.0, final_y * 1.5 - time * 0.05);
            float n = fbm(noise_coord);

            // Color palette based on the app's theme, now with blue
            vec3 color1 = vec3(0.09, 0.08, 0.12); // Dark background
            vec3 color2 = vec3(0.486, 0.227, 0.929); // Primary purple
            vec3 color3 = vec3(0.176, 0.831, 0.749); // Accent teal
            vec3 color_blue = vec3(0.2, 0.3, 0.85); // Added blue

            // Mix colors based on the noise and wave patterns
            vec3 color = mix(color1, color2, smoothstep(0.3, 0.55, n));
            
            // Add a highlight from another sine wave for more visual interest, incorporating blue
            float highlight = sin(final_y * 20.0 + time * 0.5) * 0.5 + 0.5;
            highlight = pow(highlight, 8.0);
            
            vec3 highlight_color = mix(color3, color_blue, sin(uv.x * 3.0 + time) * 0.5 + 0.5);
            color += highlight_color * highlight * 0.4;
            
            // Add a different layer of blue waves
            float blue_wave = sin(uv.y * 5.0 - time * 0.4) * 0.5 + 0.5;
            blue_wave = pow(blue_wave, 5.0);
            color = mix(color, color_blue, blue_wave * 0.2);


            // Add some fine-grained noise for a bit of grain
            color += (random(uv * 500.0) - 0.5) * 0.05;

            // Apply a vignette effect to darken the edges
            float vignette = 1.0 - length(uv - vec2(aspect*0.5, 0.5)) * 0.8;
            color *= pow(vignette, 0.7);

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const program = gl.createProgram();
    if (!program) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    function resize() {
        if (!canvasRef.current || !gl) return;
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    window.addEventListener('resize', resize);
    resize();

    let animationFrameId: number;
    function render(time: number) {
        if (!gl) return;
        gl.uniform1f(uTime, time * 0.001);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animationFrameId = requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
    };

  }, []);

  return <canvas ref={canvasRef} id="gradient-canvas" />;
}
