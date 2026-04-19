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

                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                }

                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    float a = hash(i);
                    float b = hash(i + vec2(1.0, 0.0));
                    float c = hash(i + vec2(0.0, 1.0));
                    float d = hash(i + vec2(1.0, 1.0));
                    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
                }

                float fbm(vec2 p) {
                    float v = 0.0;
                    float a = 0.5;
                    for (int i = 0; i < 4; i++) {
                        v += a * noise(p);
                        p *= 2.0;
                        a *= 0.5;
                    }
                    return v;
                }

                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                    float aspect = u_resolution.x / u_resolution.y;
                    vec2 p = uv;
                    p.x *= aspect;

                    float time = u_time * 0.35;

                    vec2 q = vec2(
                        fbm(p + time * 0.15),
                        fbm(p + vec2(1.0) + time * 0.1)
                    );

                    vec2 r = vec2(
                        fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.25 * time),
                        fbm(p + 4.0 * q + vec2(8.3, 2.8) + 0.22 * time)
                    );

                    float f = fbm(p + 4.0 * r);

                    vec3 navy = vec3(0.02, 0.04, 0.1);
                    vec3 indigo = vec3(0.08, 0.1, 0.4);
                    vec3 violet = vec3(0.4, 0.1, 0.7);
                    vec3 cyan = vec3(0.0, 0.9, 0.95);
                    vec3 orchid = vec3(0.8, 0.2, 0.9);

                    vec3 col = mix(navy, indigo, clamp(f * 2.2, 0.0, 1.0));
                    col = mix(col, violet, clamp(length(q) * 1.4, 0.0, 1.0) * 0.7);
                    
                    float highlight = pow(f, 3.5);
                    col = mix(col, cyan, highlight * 0.3);
                    col = mix(col, orchid, pow(length(r), 4.0) * 0.4);

                    float holeNoise = noise(p * 0.7 - time * 0.15);
                    float hole = smoothstep(0.18, 0.0, abs(holeNoise - 0.5) - 0.03);
                    col = mix(col, navy * 0.3, hole * 0.6);

                    float holeNoise2 = noise(p * 1.4 + vec2(15.0) + time * 0.12);
                    float hole2 = smoothstep(0.15, 0.0, abs(holeNoise2 - 0.4) - 0.02);
                    col = mix(col, navy * 0.1, hole2 * 0.7);

                    float vignette = 1.0 - length(uv - 0.5) * 0.75;
                    col *= (vignette + 0.1);

                    gl_FragColor = vec4(col, 1.0);
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
                    <h1 className="text-5xl font-extrabold tracking-[-0.04em] mb-6">Gallery</h1>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        <button className="px-6 py-2.5 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white text-sm font-semibold tracking-wide shadow-lg whitespace-nowrap">
                            This Week
                        </button>
                        <button className="px-6 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/15 text-on-surface-variant text-sm font-semibold tracking-wide hover:bg-white/5 transition-all whitespace-nowrap">
                            This Month
                        </button>
                        <button className="px-6 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/15 text-on-surface-variant text-sm font-semibold tracking-wide hover:bg-white/5 transition-all whitespace-nowrap">
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
