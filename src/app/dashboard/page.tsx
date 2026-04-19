"use client";

import { useEffect, useRef } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Menu, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ShaderCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            uniform float time;
            uniform vec2 resolution;

            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                uv.x *= resolution.x / resolution.y;

                vec3 color1 = vec3(0.04, 0.07, 0.15); // Deep Navy
                vec3 color2 = vec3(0.1, 0.05, 0.25); // Indigo
                vec3 color3 = vec3(0.4, 0.1, 0.6);   // Violet

                float t = time * 0.4;
                
                float wave1 = sin(uv.x * 2.0 + t + sin(uv.y * 3.0 + t)) * 0.5 + 0.5;
                float wave2 = sin(uv.y * 1.5 - t * 0.7 + cos(uv.x * 2.5 + t * 0.5)) * 0.5 + 0.5;
                
                float mixFactor = (wave1 + wave2) * 0.5;
                vec3 finalColor = mix(color1, color2, mixFactor);
                finalColor = mix(finalColor, color3, pow(mixFactor, 3.0) * 0.6);

                vec2 hole1Pos = vec2(0.3 + 0.1 * sin(t * 0.5), 0.5 + 0.1 * cos(t * 0.3));
                float hole1 = smoothstep(0.15, 0.0, length(uv - hole1Pos));
                
                vec2 hole2Pos = vec2(0.7 + 0.1 * cos(t * 0.4), 0.3 + 0.1 * sin(t * 0.6));
                float hole2 = smoothstep(0.12, 0.0, length(uv - hole2Pos));

                finalColor = mix(finalColor, color1 * 0.5, hole1 + hole2);

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        function createShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        }

        const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        const program = gl.createProgram();
        if (!program || !vs || !fs) return;

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const timeLocation = gl.getUniformLocation(program, 'time');
        const resolutionLocation = gl.getUniformLocation(program, 'resolution');

        function resize() {
            if(!canvasRef.current) return;
            const parent = canvasRef.current.parentElement;
            if (!parent) return;
            canvasRef.current.width = parent.clientWidth;
            canvasRef.current.height = parent.clientHeight;
            gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        window.addEventListener('resize', resize);
        resize();

        let animationFrameId: number;
        function render(now: number) {
            if (!gl) return;
            gl.uniform1f(timeLocation, now * 0.001);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return <canvas ref={canvasRef} id="shader-canvas"></canvas>
}


export default function MyDevicesPage() {
    const { toggleSidebar } = useSidebar();
    const router = useRouter();

    return (
        <div className="p-6 md:p-12 h-screen overflow-y-auto">
             <div className="ambient-bg"></div>
            <header className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <Button onClick={toggleSidebar} variant="ghost" size="icon" className="md:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.1)] group">
                            <Menu className="text-2xl group-hover:scale-110 transition-transform" />
                        </Button>
                        <h2 className="font-headline text-5xl md:text-6xl font-bold tracking-[-0.04em] text-white">My Devices</h2>
                    </div>
                    <p className="font-body text-on-surface-variant text-lg md:ml-16">Active nodes in the network.</p>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-20">
                <div className="lg:col-span-2 relative group rounded-[2rem] luminous-card">
                    <div className="card-inner rounded-[calc(2rem-1px)] overflow-hidden bg-surface-container-high/90 backdrop-blur-[24px]">
                        <ShaderCanvas />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest to-transparent z-10 pointer-events-none opacity-60"></div>
                        <div className="relative z-20 p-8 md:p-12 h-full flex flex-col justify-between min-h-[480px]">
                            <div className="flex justify-between items-start">
                                <div className="inline-flex items-center gap-2 bg-primary/20 text-on-primary-container px-4 py-1.5 rounded-full backdrop-blur-md border border-primary/30">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="font-label text-xs tracking-widest uppercase">Active Link</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-label text-sm text-primary uppercase tracking-[0.1em] mb-2 drop-shadow-md">Primary Node</p>
                                <h3 className="font-headline text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">SkySnap Pro Alpha</h3>
                                <div className="flex flex-wrap gap-6 mb-8">
                                    <div className="flex flex-col">
                                        <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Battery</span>
                                        <span className="font-body text-xl font-semibold text-white">84%</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Signal</span>
                                        <span className="font-body text-xl font-semibold text-white">Strong</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Altitude</span>
                                        <span className="font-body text-xl font-semibold text-white">1,240m</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md px-6 py-3 rounded-xl font-label text-sm uppercase tracking-widest transition-all h-auto"
                                        onClick={() => router.push('/dashboard/gallery')}
                                    >
                                        <Video className="mr-2 h-4 w-4" />
                                        view pictures taken
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-full flex flex-col">
                    <Button 
                        onClick={() => router.push('/dashboard/connect')}
                        variant="outline" 
                        className="group relative flex flex-col items-center justify-center gap-4 w-full aspect-square lg:aspect-auto lg:h-[480px] rounded-[2rem] border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 overflow-hidden p-8 h-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary-container/30 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <Plus className="text-4xl text-white" />
                        </div>
                        <div className="relative text-center">
                            <h4 className="font-headline text-xl font-bold text-white mb-1">Set up new device</h4>
                            <p className="font-body text-sm text-on-surface-variant px-8">Add your first device or set up a new one!</p>
                        </div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
                    </Button>
                </div>
            </div>
        </div>
    );
}
