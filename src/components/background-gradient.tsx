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

        // Based on Morgan McGuire @morgan3d
        // https://www.shadertoy.com/view/4dS3Wd
        float noise (in vec2 _st) {
            vec2 i = floor(_st);
            vec2 f = fract(_st);

            // Four corners in 2D of a tile
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(a, b, u.x) +
                    (c - a)* u.y * (1.0 - u.x) +
                    (d - b) * u.x * u.y;
        }

        #define NUM_OCTAVES 5
        float fbm ( in vec2 _st) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100.0);
            // Rotate to reduce axial bias
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
            // Slow down the overall animation for a more majestic feel
            float t = u_time * 0.05;

            // Background Color - darker sky
            vec3 final_color = vec3(0.01, 0.02, 0.05);

            // Aurora Palette: Add Green and shift purple to magenta
            vec3 green = vec3(0.1, 0.6, 0.3);
            vec3 magenta = vec3(0.7, 0.1, 0.5);
            vec3 cyan = vec3(0.1, 0.7, 0.7);

            // --- Main Aurora Layer ---
            // Create vertical movement feel
            vec2 p = uv;
            p.y += t * 0.1; // Slow upward drift
            p.x *= 1.5; // Stretch horizontally

            // FBM for the main curtain shape, slower horizontal movement
            float noise_val = 0.0;
            float amp = 0.6;
            vec2 shift = vec2(100.0);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
            for (int i = 0; i < 4; i++) {
                noise_val += amp * noise(p + t*0.05);
                p = rot * p * 2.0 + shift;
                amp *= 0.5;
            }

            // Distort the vertical coordinate to create the curtains
            float curtain = pow(noise_val, 2.0) * (1.0 - uv.y) * 2.0;

            // --- Detail Layer (faster shimmering) ---
            vec2 p2 = uv;
            p2.y += u_time * 0.2; // faster vertical shimmer
            float detail_noise = 0.0;
            amp = 0.5;
            for (int i = 0; i < 5; i++) {
                detail_noise += amp * noise(p2 * 5.0 - u_time * 0.1);
                p2 = rot * p2 * 1.8;
                amp *= 0.5;
            }
            curtain += pow(detail_noise, 3.0) * (1.0 - uv.y) * 0.5;

            // Color the aurora
            vec3 aurora_color = mix(green, magenta, smoothstep(0.1, 0.6, uv.y + detail_noise * 0.1));
            aurora_color = mix(aurora_color, cyan, pow(curtain, 2.5));

            // Apply the curtain mask
            final_color = mix(final_color, aurora_color, smoothstep(0.1, 0.4, curtain) * 0.9);

            // Add some faint stars
            float stars = pow(noise(uv * 200.0), 20.0);
            final_color += stars * 0.3;

            // Vignette to darken the edges
            final_color *= smoothstep(1.2, 0.2, length(uv - vec2(0.5)));

            gl_FragColor = vec4(final_color, 1.0);
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
