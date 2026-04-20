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
    // This effect hook is responsible for initializing and running the WebGL canvas background.
    // It is a self-contained script that handles shader compilation, rendering loop, and resizing.
    // No external libraries are used for the WebGL part to keep it lightweight.
    // This ensures maximum performance and compatibility across modern browsers.
    // The shader code itself is written in GLSL (OpenGL Shading Language).
    // The primary goal is to create a dynamic, visually appealing background
    // that is both performant and aesthetically pleasing, matching the app's theme.

    // Get the canvas element from the DOM using the ref created in the component.
    // This is the standard React way to interact with DOM elements directly.
    const canvas = canvasRef.current;

    // A crucial check: If the canvas element doesn't exist in the DOM for any reason,
    // we must exit early to prevent runtime errors.
    if (!canvas) {
        console.error("Canvas element not found for WebGL initialization.");
        return;
    };

    // Attempt to get the WebGL rendering context from the canvas.
    // This object is the main interface to the WebGL API.
    const gl = canvas.getContext('webgl');

    // If the WebGL context could not be created, it means the browser does not support it.
    // In this case, we log an error and gracefully fail, leaving a static background.
    if (!gl) {
        console.error("WebGL is not supported by this browser.");
        return;
    }

    // --- Vertex Shader Source Code ---
    // The vertex shader is a small program that runs on the GPU for each vertex.
    // Its primary responsibility is to calculate the final position of the vertex in clip space.
    // For a 2D full-screen effect like this one, the vertex shader is extremely simple.
    // It just takes the 2D position of a vertex from a buffer and passes it through.
    // This is because we are drawing a simple rectangle that already covers the screen.
    const vertexSource = `
        // 'attribute' is a storage qualifier for variables that are passed from the CPU
        // to the GPU and are specific to each vertex. Here, it's the 2D position.
        attribute vec2 position;

        // 'main' is the mandatory entry point for every shader program.
        void main() {
            // 'gl_Position' is a special built-in output variable in the vertex shader.
            // It must be set to the final 4D coordinate of the vertex in clip space.
            // We create a 4D vector (vec4) from our 2D 'position', with z=0.0 and w=1.0.
            // The 'w' component (1.0) is important for perspective division.
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    // --- Fragment Shader Source Code ---
    // The fragment shader is a program that runs for every single pixel (fragment) on the screen.
    // Its sole job is to determine the final color of that pixel. This is where all the visual magic happens.
    // This shader uses uniforms (u_time, u_resolution), mathematical functions (sin, pow, mix),
    // and procedural generation techniques to create the animated cosmic scene.
    const fragmentSource = `
        // Set the precision for floating-point numbers. 'highp' is the highest available precision,
        // which is good for quality but can be slightly less performant on some mobile devices.
        precision highp float;

        // --- Uniforms ---
        // Uniforms are variables passed from the CPU (JavaScript) to the shaders (GPU).
        // Their value is constant for all pixels processed in a single draw call.
        
        // 'u_time' is a uniform that receives the continuously increasing elapsed time from JavaScript.
        // This is the core driver for all animations within the shader.
        uniform float u_time;
        
        // 'u_resolution' is a uniform that receives the width and height of the canvas.
        // This is used to normalize pixel coordinates, making the shader resolution-independent.
        uniform vec2 u_resolution;

        // --- Color Palette Definition ---
        // We define our core colors as constants ('const') for organization and easy tweaking.
        // These colors are derived from the application's overall design theme to ensure visual consistency.
        // Using constants also allows the shader compiler to perform potential optimizations.
        
        // A deep, dark blue that serves as the foundational color of our entire cosmic scene.
        const vec3 NAVY = vec3(0.02, 0.05, 0.12);
        
        // A richer, mid-tone blue used for the first and largest layer of color, providing a base for highlights.
        const vec3 INDIGO = vec3(0.08, 0.08, 0.28);
        
        // A vibrant violet for the main highlight color band, creating the most prominent visual feature.
        const vec3 VIOLET = vec3(0.18, 0.12, 0.45);
        
        // A bright, almost neon violet used for the fast-moving, shimmering ripple highlights.
        const vec3 LIGHT_VIOLET = vec3(0.35, 0.25, 0.7);

        // --- Main Shader Logic ---
        // This is the main entry point for the fragment shader. It is executed once for every
        // single pixel being rendered to the screen to calculate its final color.
        void main() {
            // --- UV Coordinate Normalization ---
            // 'uv' represents the coordinate of the current pixel.
            // 'gl_FragCoord.xy' gives the pixel's coordinate in pixels (e.g., from (0,0) to (width, height)).
            // We divide by 'u_resolution' to normalize this into a 0.0 to 1.0 range (from bottom-left).
            // This makes all subsequent calculations independent of the screen's resolution.
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;

            // --- Time-Based Animation Variable ---
            // 't' is our primary animation variable, derived from the 'u_time' uniform.
            // We multiply by 0.25 to slow down the overall animation for a more calming, ambient effect.
            // Changing this value will speed up or slow down everything that depends on 't'.
            float t = u_time * 0.25;

            // --- Wave Generation ---
            // We generate three distinct sine waves that travel horizontally across the screen.
            // Each wave uses a different frequency (the multiplier of uv.x), speed (the multiplier of t),
            // and amplitude (the final multiplier) to create a layered, parallax effect.
            // This technique gives the background a sense of depth and complex, fluid motion.
            
            // The first wave: slow and has a medium width and amplitude.
            float wave1 = sin(uv.x * 2.5 + t * 0.8) * 0.08;
            
            // The second wave: faster, tighter, and with a smaller amplitude for a subtle effect.
            float wave2 = sin(uv.x * 4.0 - t * 1.2) * 0.05;
            
            // The third wave: very slow and very wide, creating a gentle, large-scale background shift.
            float wave3 = sin(uv.x * 1.5 + t * 0.4) * 0.12;

            // --- Color Band Boundary Calculation ---
            // The y-positions of the boundaries between our color bands are modulated by the sine waves.
            // This is the key to making the color bands appear to flow and undulate like liquid or gas.
            
            // The boundary for the first color transition (from Navy to Indigo).
            float boundary1 = 0.35 + wave1;
            
            // The boundary for the second color transition (from Indigo to Violet).
            float boundary2 = 0.65 + wave2;
            
            // A third boundary, unused in the final color mix but kept for potential future enhancements or more complex layering.
            float boundary3 = 0.85 + wave3;

            // --- Color Mixing and Layering ---
            // We build our final color layer by layer, starting with the base color and blending upwards.
            
            // Initialize the final color with the darkest base color, NAVY.
            vec3 color = NAVY;
            
            // Mix in the INDIGO color band.
            // 'smoothstep(edge0, edge1, x)' creates a smooth transition from 0.0 to 1.0 as 'x' goes from 'edge0' to 'edge1'.
            // This is essential for creating a soft, anti-aliased gradient instead of a hard, pixelated line.
            // We create a soft gradient around the boundary to blend the colors naturally.
            float mask1 = smoothstep(boundary1 - 0.15, boundary1 + 0.15, uv.y);
            color = mix(color, INDIGO, mask1);

            // Mix in the VIOLET color band on top of the previous result (which is already a mix of Navy and Indigo).
            // This layering of mixed colors adds complexity and richness to the final gradient.
            // We use a slightly wider blend range (0.2) for an even softer, more diffuse transition.
            float mask2 = smoothstep(boundary2 - 0.2, boundary2 + 0.2, uv.y);
            color = mix(color, VIOLET, mask2);

            // --- Shimmering Ripple Effect ---
            // To add more dynamic detail and a sense of energy, we create a high-frequency ripple pattern.
            // This simulates light glinting off a distant, uneven surface, like light on water.
            
            // A sine wave is generated based on both x and y coordinates, plus time.
            // Using both x and y with different multipliers makes the wave travel diagonally.
            float ripple = sin(uv.x * 10.0 - uv.y * 5.0 + t * 2.0) * 0.5 + 0.5;
            
            // We use the 'pow' function to sharpen the peaks of the ripple wave.
            // Raising the color value to a high power (e.g., 8.0) makes the bright parts of the wave
            // (values close to 1.0) stay bright while very quickly diminishing the darker parts to almost zero.
            // This creates the appearance of sharp, bright, shimmering highlights rather than a soft wave.
            float rippleMask = pow(ripple, 8.0) * 0.08;
            
            // The calculated ripple mask is then used to additively blend the bright LIGHT_VIOLET color to the scene.
            color += LIGHT_VIOLET * rippleMask;

            // --- Depth and Vignette Finishing Effects ---
            // These final touches are post-processing steps that enhance the overall composition.
            
            // First, a vertical gradient is applied to the color.
            // The bottom of the scene (where uv.y is near 1.0) is made slightly brighter,
            // while the top (uv.y near 0.0) is made slightly darker.
            // This can mimic atmospheric perspective or a light source from below.
            color *= mix(0.7, 1.2, uv.y);

            // Finally, a vignette is applied to darken the edges and corners of the canvas.
            // This is a classic photographic and cinematic technique to draw the viewer's focus toward the center.
            // We calculate the distance of the current pixel from the center of the screen (0.5, 0.5).
            float dist = length(uv - 0.5);
            // We then use 'smoothstep' to create a soft, circular mask that is bright in the center and dark at the edges.
            color *= smoothstep(1.2, 0.2, dist);

            // --- Final Output Color ---
            // 'gl_FragColor' is the special, built-in output variable for the fragment shader.
            // It must be set to the final calculated color for the current pixel.
            // We use the 'color' we've built up, and set the alpha channel (w) to 1.0 for full opacity.
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // --- Helper Function to Create and Compile Shaders ---
    function createShader(glContext: WebGLRenderingContext, type: number, source: string) {
        // Create a new shader object of the specified type (VERTEX_SHADER or FRAGMENT_SHADER).
        const shader = glContext.createShader(type);
        if (!shader) return null;

        // Provide the shader source code to the shader object.
        glContext.shaderSource(shader, source);

        // Compile the shader source code into a program the GPU can run.
        glContext.compileShader(shader);

        // Check if the compilation was successful. This is a critical debugging step.
        if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
            // If compilation failed, log the detailed error information from the GPU to the console.
            console.error('An error occurred compiling the shaders: ' + glContext.getShaderInfoLog(shader));
            // Clean up the failed shader object to prevent memory leaks.
            glContext.deleteShader(shader);
            return null;
        }

        // If compilation was successful, return the compiled shader object.
        return shader;
    }

    // Create the main WebGL program which will hold the linked shaders.
    const program = gl.createProgram();
    if (!program) return;

    // Create and compile the vertex and fragment shaders from their source code.
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    // If either shader failed to compile, we cannot proceed.
    if (!vertexShader || !fragmentShader) return;

    // Attach the compiled shaders to the WebGL program.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the shaders together into a single, complete WebGL program.
    gl.linkProgram(program);
    
    // Tell WebGL to use this program for all subsequent rendering operations.
    gl.useProgram(program);

    // --- Data Buffers for Geometry ---
    // We need to provide the vertex shader with the 2D coordinates of the vertices
    // that form the shape we want to draw. In this case, it's a simple rectangle
    // that will cover the entire screen, on which the fragment shader will "paint".

    // Create a buffer object on the GPU to hold our vertex data.
    const buffer = gl.createBuffer();
    // Bind the buffer, making it the active ARRAY_BUFFER. All subsequent buffer operations will affect this one.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Define the vertices of two triangles that form a rectangle covering the entire clip space (-1 to +1 in both X and Y).
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    // Send our vertex data from the CPU to the currently bound GPU buffer.
    // STATIC_DRAW is a performance hint to WebGL that this data will not change frequently.
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // --- Connecting Attributes and Uniforms ---
    // Get the memory location (a numerical "address") of the 'position' attribute in the linked vertex shader program.
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    // Enable this vertex attribute. If disabled, it would not be accessible by the shader.
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Tell WebGL how to read the data from the currently bound buffer for the 'position' attribute.
    // It specifies: 2 components per vertex, type is FLOAT, don't normalize, 0 stride, 0 offset.
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Get the memory locations of the 'u_time' and 'u_resolution' uniforms in the fragment shader.
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

    // --- Resize Handler and Render Loop ---
    // This section makes the WebGL canvas responsive and continuously animates it.
    
    // A function to handle resizing of the browser window.
    function handleResize() {
        if (!canvasRef.current || !gl) return;
        // Set the canvas's internal drawing buffer size to match its display size in CSS pixels.
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Tell WebGL how to convert from clip space (-1 to +1) to screen space (pixels).
        gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    // Add an event listener to call our resize handler whenever the browser window is resized.
    window.addEventListener('resize', handleResize);
    // Call it once at the start to set the initial size correctly.
    handleResize();

    // A variable to hold the ID of the animation frame request.
    let animationFrameId: number;
    
    // The main rendering function that will be called for each frame.
    function render(time: number) {
      if (!gl || !canvasRef.current) return; // Exit if context or canvas is lost.
        
      // Update the 'u_time' uniform in the fragment shader with the current time (converted to seconds).
      gl.uniform1f(timeUniformLocation, time * 0.001);
        
      // Update the 'u_resolution' uniform with the current canvas dimensions.
      gl.uniform2f(resolutionUniformLocation, canvasRef.current.width, canvasRef.current.height);
        
      // Instruct the GPU to draw the triangles. We defined 6 vertices (2 triangles), so we draw all 6.
      gl.drawArrays(gl.TRIANGLES, 0, 6);
        
      // Request that the browser call this 'render' function again before the next repaint.
      // This creates a smooth animation loop.
      animationFrameId = requestAnimationFrame(render);
    }
    // Start the rendering loop for the very first time.
    requestAnimationFrame(render);

    // --- Cleanup Function ---
    // This function is returned by the useEffect hook. React will call it when the component unmounts.
    // This is crucial for preventing memory leaks and unnecessary processing.
    return () => {
      // Remove the resize event listener from the window object.
      window.removeEventListener('resize', handleResize);
      
      // Stop the animation loop by canceling the next requested animation frame.
      if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
      }
    };
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
            <form className="space-y-6" onSubmit={handleEmailSignIn}>
              <div className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-xs font-medium text-on-surface-variant/70 ml-1" htmlFor="email">Email</label>
                  <div className="relative rounded-xl border border-outline-variant/20">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-lg">mail</span>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-lowest/30 border-0 rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:outline-none transition-all duration-300" id="email" placeholder="name@company.com" type="email"/>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-medium text-on-surface-variant/70 ml-1" htmlFor="password">Password</label>
                  <div className="relative rounded-xl border border-outline-variant/20">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-lg">lock</span>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface-container-lowest/30 border-0 rounded-xl py-3.5 pl-12 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:outline-none transition-all duration-300" id="password" placeholder="••••••••" type={showPassword ? "text" : "password"}/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors">
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
