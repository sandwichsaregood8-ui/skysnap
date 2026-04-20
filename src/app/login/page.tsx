'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { emailSignIn, googleSignIn, user, loading } = useAuth();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');

    if (gl) {
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
            }
            return shader;
        }

        const program = gl.createProgram();
        if (!program) return;
        const vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        if (!vs || !fs) return;
        
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
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
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
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
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }
    }
  }, []);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await emailSignIn(email, password);
  };
  
  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    await googleSignIn();
  };

  return (
    <>
      <canvas ref={canvasRef} id="gradient-canvas" />
      <main className="w-full h-screen flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-md relative">
          <div className="glass-card chromatic-border rounded-[2rem] p-10 ambient-glow">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-xl" style={{fontVariationSettings: "'FILL' 1"}}>cloud</span>
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
            <form className="space-y-6" onSubmit={handleEmailSignIn}>
              <div className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-xs font-medium text-on-surface-variant/70 ml-1" htmlFor="email">Email</label>
                  <div className="relative rounded-xl border border-outline-variant/20">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-lg">mail</span>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-lowest/30 border-0 rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline-variant/40 focus:ring-0 focus:outline-none transition-all duration-300" id="email" placeholder="name@company.com" type="email"/>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-medium text-on-surface-variant/70 ml-1" htmlFor="password">Password</label>
                  <div className="relative rounded-xl border border-outline-variant/20">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-lg">lock</span>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface-container-lowest/30 border-0 rounded-xl py-3.5 pl-12 pr-12 text-on-surface placeholder:text-outline-variant/40 focus:ring-0 focus:outline-none transition-all duration-300" id="password" placeholder="••••••••" type={showPassword ? "text" : "password"}/>
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors" type="button">
                      <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded border border-outline-variant/30 bg-surface-container-lowest group-hover:border-primary/50 transition-colors">
                    <input className="sr-only peer" type="checkbox"/>
                    <span className="material-symbols-outlined text-[12px] text-primary opacity-0 peer-checked:opacity-100 transition-opacity absolute inset-0 m-auto flex items-center justify-center">check</span>
                  </div>
                  <span className="text-xs text-on-surface-variant/80">Keep me signed in</span>
                </label>
                <a className="text-xs text-primary/80 hover:text-primary transition-colors font-medium" href="#">Forgot password?</a>
              </div>
              <button className="w-full group rounded-xl bg-primary text-white py-4 font-semibold tracking-wide hover:bg-primary-container transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2" type="submit">
                <span>Sign In</span>
                <span className="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-outline-variant/10"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-on-surface-variant/40">or</span>
                <div className="flex-grow border-t border-outline-variant/10"></div>
              </div>
              <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-outline-variant/20 bg-surface-container-lowest/30 hover:bg-surface-container-lowest/50 transition-all duration-300 group" type="button">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="text-sm font-medium text-on-surface">Sign in with Google</span>
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
