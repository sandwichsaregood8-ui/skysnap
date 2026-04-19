"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function GalleryPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { toggleSidebar } = useSidebar();

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

                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                    uv.x *= u_resolution.x / u_resolution.y;

                    vec3 color1 = vec3(0.04, 0.07, 0.15); // Deep Navy
                    vec3 color2 = vec3(0.1, 0.05, 0.25); // Indigo
                    vec3 color3 = vec3(0.4, 0.1, 0.6);   // Violet

                    float t = u_time * 0.4;
                    
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

            function createShader(gl, type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error(gl.getShaderInfoLog(shader));
                }
                return shader;
            }

            const program = gl.createProgram();
            gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexSource));
            gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
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
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
            window.addEventListener('resize', resize);
            resize();

            function render(time) {
                gl.uniform1f(uTime, time * 0.001);
                gl.uniform2f(uRes, canvas.width, canvas.height);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        }
    }, []);

    return (
        <div className="bg-surface text-on-surface min-h-screen">
            <canvas id="gradient-canvas" ref={canvasRef}></canvas>
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0B1326]/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(11,19,38,0.5)]">
                <div className="flex items-center gap-4">
                    <Button onClick={toggleSidebar} variant="ghost" size="icon" className="p-2 rounded-full hover:bg-white/5 transition-colors active:scale-95 duration-200">
                        <Menu className="text-primary" />
                    </Button>
                </div>
                <div></div>
            </header>
            <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
                <section className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.04em] mb-6">Gallery</h1>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        <button className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white text-sm font-semibold tracking-wide shadow-lg whitespace-nowrap">
                            This Week
                        </button>
                        <button className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-surface-container-high border border-outline-variant/15 text-on-surface-variant text-sm font-semibold tracking-wide hover:bg-white/5 transition-all whitespace-nowrap">
                            This Month
                        </button>
                        <button className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-surface-container-high border border-outline-variant/15 text-on-surface-variant text-sm font-semibold tracking-wide hover:bg-white/5 transition-all whitespace-nowrap">
                            All Time
                        </button>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 group relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/9] shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                        <Image
                            alt="Orion Nebula"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint={PlaceHolderImages[0].imageHint}
                            src={PlaceHolderImages[0].imageUrl}
                            width={1280}
                            height={720}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                            <p className="text-xs font-bold tracking-[0.1em] text-primary mb-1 uppercase">Deep Sky</p>
                            <h3 className="text-2xl font-bold tracking-tight">The Helix Nebula Core</h3>
                        </div>
                    </div>
                    <div className="md:col-span-4 group relative rounded-3xl overflow-hidden aspect-square shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                         <Image
                            alt="Star Trails"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint={PlaceHolderImages[1].imageHint}
                            src={PlaceHolderImages[1].imageUrl}
                            width={800}
                            height={800}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                            <p className="text-xs font-bold tracking-[0.1em] text-primary mb-1 uppercase">Long Exposure</p>
                            <h3 className="text-xl font-bold tracking-tight">Polaris Rotation</h3>
                        </div>
                    </div>
                    <div className="md:col-span-4 group relative rounded-3xl overflow-hidden aspect-square shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                        <Image
                            alt="Aurora Borealis"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint={PlaceHolderImages[2].imageHint}
                            src={PlaceHolderImages[2].imageUrl}
                            width={800}
                            height={800}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                            <p className="text-xs font-bold tracking-[0.1em] text-primary mb-1 uppercase">Atmospheric</p>
                            <h3 className="text-xl font-bold tracking-tight">Nordic Glow</h3>
                        </div>
                    </div>
                    <div className="md:col-span-4 group relative rounded-3xl overflow-hidden aspect-square shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                        <Image
                            alt="Galaxy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint={PlaceHolderImages[3].imageHint}
                            src={PlaceHolderImages[3].imageUrl}
                            width={800}
                            height={800}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                            <p className="text-xs font-bold tracking-[0.1em] text-primary mb-1 uppercase">Intergalactic</p>
                            <h3 className="text-xl font-bold tracking-tight">M31 Andromeda</h3>
                        </div>
                    </div>
                    <div className="md:col-span-4 group relative rounded-3xl overflow-hidden aspect-square shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                        <Image
                            alt="Milky Way"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint={PlaceHolderImages[4].imageHint}
                            src={PlaceHolderImages[4].imageUrl}
                            width={800}
                            height={800}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                            <p className="text-xs font-bold tracking-[0.1em] text-primary mb-1 uppercase">Panorama</p>
                            <h3 className="text-xl font-bold tracking-tight">Canyon Core</h3>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
