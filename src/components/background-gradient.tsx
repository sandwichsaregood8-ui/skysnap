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

        // Using colors inspired by the image, very dark and subtle.
        const vec3 color_bg = vec3(0.04, 0.07, 0.15);      // Deep Navy (#0a1226)
        const vec3 color_highlight1 = vec3(0.1, 0.05, 0.25); // Indigo
        const vec3 color_highlight2 = vec3(0.15, 0.1, 0.3);   // Faint Violet

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            float t = u_time * 0.1; // Slow time for subtle movement

            // Create two very wide, slow-moving, overlapping waves
            float wave1 = sin(uv.x * 0.5 - uv.y * 0.2 + t) * 0.5 + 0.5;
            float wave2 = cos(uv.y * 0.7 + uv.x * 0.3 - t * 0.8) * 0.5 + 0.5;
            
            // Mix the colors. The waves will control the mix factor.
            vec3 color = mix(color_bg, color_highlight1, wave1 * 0.25); // highlight 1 is subtle
            color = mix(color, color_highlight2, wave2 * 0.15); // highlight 2 is even more subtle

            // A dark vignette to keep focus on the center and match the image
            float vignette = smoothstep(1.0, 0.4, length(uv - vec2(0.5)));
            color *= vignette;

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
