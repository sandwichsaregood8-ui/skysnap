'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// This is the main login page for the application.
// It provides two methods for authentication: Google Sign-In and Magic Link.
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { googleSignIn, sendMagicLink, user, loading } = useAuth();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Effect to redirect the user to the dashboard if they are already logged in.
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // This effect hook is responsible for initializing and running the WebGL canvas background.
  // It is a self-contained script that handles shader compilation and the rendering loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error("WebGL is not supported by this browser.");
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
        const vec3 NAVY = vec3(0.02, 0.05, 0.12);
        const vec3 INDIGO = vec3(0.08, 0.08, 0.28);
        const vec3 VIOLET = vec3(0.18, 0.12, 0.45);
        const vec3 LIGHT_VIOLET = vec3(0.35, 0.25, 0.7);
        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            float t = u_time * 0.25;
            float wave1 = sin(uv.x * 2.5 + t * 0.8) * 0.08;
            float wave2 = sin(uv.x * 4.0 - t * 1.2) * 0.05;
            float wave3 = sin(uv.x * 1.5 + t * 0.4) * 0.12;
            float boundary1 = 0.35 + wave1;
            float boundary2 = 0.65 + wave2;
            vec3 color = NAVY;
            float mask1 = smoothstep(boundary1 - 0.15, boundary1 + 0.15, uv.y);
            color = mix(color, INDIGO, mask1);
            float mask2 = smoothstep(boundary2 - 0.2, boundary2 + 0.2, uv.y);
            color = mix(color, VIOLET, mask2);
            float ripple = sin(uv.x * 10.0 - uv.y * 5.0 + t * 2.0) * 0.5 + 0.5;
            float rippleMask = pow(ripple, 8.0) * 0.08;
            color += LIGHT_VIOLET * rippleMask;
            color *= mix(0.7, 1.2, uv.y);
            float dist = length(uv - 0.5);
            color *= smoothstep(1.2, 0.2, dist);
            gl_FragColor = vec4(color, 1.0);
        }
    `;
    function createShader(glContext: WebGLRenderingContext, type: number, source: string) {
        const shader = glContext.createShader(type);
        if (!shader) return null;
        glContext.shaderSource(shader, source);
        glContext.compileShader(shader);
        if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + glContext.getShaderInfoLog(shader));
            glContext.deleteShader(shader);
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
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    function handleResize() {
        if (!canvasRef.current || !gl) return;
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    let animationFrameId: number;
    function render(time: number) {
      if (!gl || !canvasRef.current) return;
      gl.uniform1f(timeUniformLocation, time * 0.001);
      gl.uniform2f(resolutionUniformLocation, canvasRef.current.width, canvasRef.current.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Handler for the magic link form submission
  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await sendMagicLink(email);
  };
  
  // Handler for the Google sign-in button click
  const handleGoogleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    googleSignIn();
  };

  return (
    <>
      <canvas ref={canvasRef} id="gradient-canvas" className="w-full h-full" />
      <main className="w-full h-screen flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-md relative">
          <div className="glass-card chromatic-border rounded-[2rem] p-10 ambient-glow">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-xl material-symbols-fill">cloud</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight bg-gradient-to-br from-primary via-on-surface to-secondary bg-clip-text text-transparent font-headline">SkySnap</span>
                    <span className="text-on-surface-variant/30 text-xs">|</span>
                    <h2 className="text-xl font-semibold text-on-surface">Sign In</h2>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">welcome back.</p>
                </div>
              </div>
            </div>
            <form className="space-y-6" onSubmit={handleMagicLinkSignIn}>
              <div className="space-y-2 group">
                <label className="text-xs font-medium text-on-surface-variant/70 ml-1" htmlFor="email">Email</label>
                <div className="relative rounded-xl border border-outline-variant/20">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-lg">mail</span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="w-full bg-surface-container-lowest/30 border-0 rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:outline-none transition-all duration-300" id="email" placeholder="name@company.com" type="email" required />
                </div>
              </div>
              
              <button className="w-full group rounded-xl bg-primary text-white py-4 font-semibold tracking-wide hover:bg-primary-container transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2" type="submit" disabled={loading}>
                <span>{loading ? 'Sending...' : 'Send Magic Link'}</span>
                <span className="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-outline-variant/10"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-on-surface-variant/40">or</span>
                <div className="flex-grow border-t border-outline-variant/10"></div>
              </div>
              
              <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-outline-variant/20 bg-surface-container-lowest/30 hover:bg-surface-container-lowest/50 transition-all duration-300 group" type="button">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="text-sm font-medium text-on-surface">{loading ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
            </form>
            <div className="mt-10 pt-6 border-t border-outline-variant/10 text-center">
              <p className="text-sm text-on-surface-variant/70">New here? <Link className="text-primary hover:underline font-medium" href="/signup">Create Account</Link></p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
