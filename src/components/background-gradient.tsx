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

    const fragmentSource = `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;

        float random (in vec2 _st) {
            return fract(sin(dot(_st.xy,
                                 vec2(12.9898,78.233)))*
                43758.5453123);
        }

        float noise (in vec2 _st) {
            vec2 i = floor(_st);
            vec2 f = fract(_st);

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(mix(random(i + vec2(0.0,0.0)), random(i + vec2(1.0,0.0)), u.x),
                       mix(random(i + vec2(0.0,1.0)), random(i + vec2(1.0,1.0)), u.x),
                       u.y);
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
            float aspectRatio = u_resolution.x/u_resolution.y;
            vec2 centered_uv = uv - vec2(0.5, 0.5);
            centered_uv.x *= aspectRatio;
            
            // Wide angle effect
            float lens_dist = length(centered_uv);
            centered_uv = centered_uv * (1.0 - lens_dist * 0.1);
            
            vec2 p = centered_uv + vec2(0.5, 0.5);
            p.x /= aspectRatio;

            float t = u_time * 0.15; // Forward movement

            // Base color
            vec3 color = vec3(0.01, 0.02, 0.08); // Dark space blue

            // Color Palette (no pink)
            vec3 purple = vec3(0.48, 0.18, 0.98);
            vec3 teal = vec3(0.18, 0.98, 0.78);
            
            // SELF-REMINDER: THE WAVES CANNOT BE VERTICAL. THEY MUST BE HORIZONTAL.
            // Wave calculation is based on y for horizontal bands.
            // A very slow upward movement is added to the distortion coordinate.
            vec2 fbm_coord = p * 0.5 + vec2(t * 0.1, u_time * 0.00005);
            float y = p.y + fbm(fbm_coord) * 0.1; 

            // Create multiple horizontal waves with longer periods (lower frequency)
            float wave1 = 1.0 - abs(sin(y * 4.0 - t));
            wave1 = pow(wave1, 8.0);

            float wave2 = 1.0 - abs(sin(y * 6.0 - t * 1.2));
            wave2 = pow(wave2, 10.0);

            // Combining waves
            float combined_wave = wave1 * 0.6 + wave2 * 0.4;

            // Detailed noise for texture and movement
            float noise_texture = fbm(p * 3.0 + vec2(t * 0.3, u_time * 0.00005));
            
            // Mix colors
            vec3 aurora_color = mix(purple, teal, noise_texture);
            
            // Apply the wave as a mask, making it more intense. Amplitude adjustment here.
            color = mix(color, aurora_color, combined_wave);

            // Reduce stars significantly
            float stars = pow(noise(p * 300.0), 30.0);
            color += stars * 0.1;

            // Vignette to darken edges
            color *= smoothstep(1.2, 0.3, lens_dist);

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
