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

        // Palette
        const vec3 NAVY = vec3(0.02, 0.05, 0.12);
        const vec3 INDIGO = vec3(0.08, 0.08, 0.28);
        const vec3 VIOLET = vec3(0.18, 0.12, 0.45);
        const vec3 LIGHT_VIOLET = vec3(0.35, 0.25, 0.7);

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            float t = u_time * 0.25;

            // Create layered horizontal sine waves
            float wave1 = sin(uv.x * 2.5 + t * 0.8) * 0.08;
            float wave2 = sin(uv.x * 4.0 - t * 1.2) * 0.05;
            float wave3 = sin(uv.x * 1.5 + t * 0.4) * 0.12;

            // Boundary positions for bands
            float boundary1 = 0.35 + wave1;
            float boundary2 = 0.65 + wave2;
            float boundary3 = 0.85 + wave3;

            // Mix colors with clean but smooth transitions
            vec3 color = NAVY;
            
            // Indigo band
            float mask1 = smoothstep(boundary1 - 0.15, boundary1 + 0.15, uv.y);
            color = mix(color, INDIGO, mask1);

            // Violet band
            float mask2 = smoothstep(boundary2 - 0.2, boundary2 + 0.2, uv.y);
            color = mix(color, VIOLET, mask2);

            // Subtle light ripples travelling across
            float ripple = sin(uv.x * 10.0 - uv.y * 5.0 + t * 2.0) * 0.5 + 0.5;
            float rippleMask = pow(ripple, 8.0) * 0.08;
            color += LIGHT_VIOLET * rippleMask;

            // Add depth with vertical gradient
            color *= mix(0.7, 1.2, uv.y);

            // Vignette for focus
            float dist = length(uv - 0.5);
            color *= smoothstep(1.2, 0.2, dist);

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
