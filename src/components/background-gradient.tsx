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

        // The aurora effect is created by layering multiple noise functions (fbm)
        // to create a flowing, organic shape. The colors are blended based on
        // the noise values to get the multi-colored aurora feel from the image.

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
            float t = u_time * 0.05; // Slowed down animation

            // Background Color
            vec3 final_color = vec3(0.005, 0.005, 0.015);

            // Create a flowing, distorted coordinate space for the aurora
            vec2 pos = uv;
            pos.y *= 1.4; // Stretch the noise vertically
            pos.x *= 0.7; // Stretch the noise horizontally
            float f = fbm(pos * 1.2 + vec2(0.0, t * -0.3));
            
            // Create the main aurora shape from the noise, making it a wide band
            float aurora_shape = smoothstep(0.45, 0.6, f) - smoothstep(0.6, 0.7,f);

            // Define the aurora colors from the image
            vec3 purple = vec3(0.4, 0.15, 0.6);
            vec3 blue = vec3(0.1, 0.3, 0.8);
            vec3 cyan = vec3(0.1, 0.7, 0.7);

            // Layer the colors based on another noise pattern to create variety within the band
            float color_noise = fbm(uv * 3.0 + vec2(0.0, t * 0.2));
            vec3 aurora_color = mix(purple, blue, smoothstep(0.4, 0.6, color_noise));
            aurora_color = mix(aurora_color, cyan, smoothstep(0.55, 0.7, color_noise));

            // Combine shape and color
            final_color += aurora_color * aurora_shape * 1.2;
            
            // Add faint dot grid on top
            vec2 grid_uv = fract(gl_FragCoord.xy / 8.0);
            float dot_dist = distance(grid_uv, vec2(0.5));
            float dots = 1.0 - smoothstep(0.4, 0.45, dot_dist);
            final_color += dots * 0.04;

            // Vignette to darken the edges
            final_color *= smoothstep(1.3, 0.35, length(uv - vec2(0.5)));

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
