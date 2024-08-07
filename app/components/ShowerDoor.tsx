import React, {useEffect, useRef, useState} from 'react';
import {useFrame, useThree, extend, type Size} from '@react-three/fiber';
import {type Mesh, ShaderMaterial, Vector2, Vector3, Texture} from 'three';
import {useTexture} from '@react-three/drei';

const vertexShader = `
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec2 resolution;
  uniform vec3 mouse;
  uniform float time;
  uniform float aspect;
  uniform sampler2D tex;
  uniform float imageAspect;
  uniform float viewportAspect;
  in vec2 vUv;

  #define T time
  #define R resolution

  vec3 N13(float p) {
    vec3 p3 = fract(vec3(p) * vec3(.1031, .11369, .13787));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
  }

  vec4 N14(float t) {
    return fract(sin(t * vec4(123., 1024., 1456., 264.)) * vec4(6547., 345., 8799., 1564.));
  }

  float N(float t) {
    return fract(sin(t * 12345.564) * 7658.76);
  }

  float Saw(float b, float t) {
    return smoothstep(0., b, t) * smoothstep(1., b, t);
  }

  vec2 DropLayer2(vec2 uv, float t) {
    vec2 UV = uv * vec2(1,-1);

    UV.y += t * 0.75;

    vec2 a = vec2(6., 1.);
    vec2 grid = a * 2.;
    vec2 id = floor(UV * grid);

    float colShift = N(id.x);
    UV.y += colShift;

    id = floor(UV * grid);
    vec3 n = N13(id.x * 35.2 + id.y * 2376.1);
    vec2 st = fract(UV * grid) - vec2(.5, 0);

    float x = n.x - .5;

    float y = UV.y * 20.;
    float wiggle = sin(y + sin(y));
    x += wiggle * (.5 - abs(x)) * (n.z - .5);
    x *= .7;
    float ti = fract(t + n.z);
    y = (Saw(.85, ti) - .5) * .9 + .5;
    vec2 p = vec2(x, y);

    float d = length((st - p) * a.yx);

    float mainDrop = smoothstep(.4, .0, d);

    float r = sqrt(smoothstep(1., y, st.y));
    float cd = abs(st.x - x);
    float trail = smoothstep(.23 * r, .15 * r * r, cd);
    float trailFront = smoothstep(-.02, .02, st.y - y);
    trail *= trailFront * r * r;

    y = UV.y;
    float trail2 = smoothstep(.2 * r, .0, cd);
    float droplets = max(0., (sin(y * (1. - y) * 120.) - st.y)) * trail2 * trailFront * n.z;
    y = fract(y * 10.) + (st.y - .5);
    float dd = length(st - vec2(x, y));
    droplets = smoothstep(.3, 0., dd);
    float m = mainDrop + droplets * r * trailFront;

    return vec2(m, trail);
  }

  float StaticDrops(vec2 uv, float t) {
    uv *= 40.;

    vec2 id = floor(uv);
    uv = fract(uv) - .5;
    vec3 n = N13(id.x * 107.45 + id.y * 3543.654);
    vec2 p = (n.xy - .5) * .7;
    float d = length(uv - p);

    float fade = Saw(.025, fract(t + n.z));
    float c = smoothstep(.3, 0., d) * fract(n.z * 10.) * fade;
    return c;
  }

  vec2 Drops(vec2 uv, float t, float l0, float l1, float l2) {
    float s = StaticDrops(uv, t) * l0;
    vec2 m1 = DropLayer2(uv, t) * l1;
    vec2 m2 = DropLayer2(uv * 1.85, t) * l2;

    float c = s + m1.x + m2.x;
    c = smoothstep(.3, 1., c);

    return vec2(c, max(m1.y * l0, m2.y * l1));
  }

  void main() {
    vec2 ratio = vec2(R.x/R.y,1.);

    vec2 scaled;
    if (imageAspect > viewportAspect) {
      scaled = (vUv - 0.5) * vec2(viewportAspect / imageAspect, 1.0) + 0.5;
    } else {
      scaled = (vUv - 0.5) * vec2(1.0, imageAspect / viewportAspect) + 0.5;
    }

    vec2 M = (mouse.xy * 2. - 1.) * ratio ;
    vec2 uv = (vUv * 2. - 1.) * ratio * vec2(1.,-1.) * 0.425;
    vec2 p = ((scaled * 2. - 1.)* 0.925 + M * .0125)*.5+.5;
    float d = smoothstep(0.0,0.4,length(mouse.xy * ratio-vUv* ratio));
    float t = T *.2;
    float rainAmount = (sin(t * 0.01) * 0.5 + .5)*d;
    float maxBlur = mix(1., 8., rainAmount);
    float minBlur = 2.;
    float staticDrops = smoothstep(-.5, 1., rainAmount)*2.;
    float layer1 = smoothstep(.25, .75, rainAmount);
    float layer2 = smoothstep(.0, .5, rainAmount);

    vec2 c = Drops(uv, t, staticDrops, layer1, layer2);
    vec2 e = vec2(.00125, 0.);
    float cx = Drops(uv+e, t, staticDrops, layer1, layer2).x;
    float cy = Drops(uv+e.yx, t, staticDrops, layer1, layer2).x;
    vec2 n = vec2(cx-c.x, cy-c.x);
    float focus = mix(maxBlur-c.y, minBlur, smoothstep(.1, .2, c.x));
    vec3 color = textureLod(tex, scaled + n * 0.25 , focus * d).rgb;

    gl_FragColor = vec4(color, 1.0);

  }
`;

// Define RainMaterial as a class
class RainMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        resolution: {value: new Vector2()},
        mouse: {value: new Vector3()},
        time: {value: 0},
        tex: {value: new Texture()},
        aspect: {value: 1},
        pixelRatio: {value: 1},
        imageAspect: {value: 1},
        viewportAspect: {value: 1},
      },
      vertexShader,
      fragmentShader,
    });
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    rainMaterial: ThreeElements['shaderMaterial'] & RainMaterial;
  }
}

// Extend it for use in JSX
extend({RainMaterial});

interface RainEffectProps {
  backgroundImage?: string;
}

const RainEffect: React.FC<RainEffectProps> = ({
  backgroundImage = 'https://cdn.shopify.com/s/files/1/0817/9308/9592/files/background-image.jpg?v=1720660332',
}) => {
  const {viewport, size} = useThree();
  const materialRef = useRef<RainMaterial>(null);
  const meshRef = useRef<Mesh>(null);
  const [mousePressed, setMousePressed] = useState(false);
  const pixelRatio = window.devicePixelRatio || 2;

  const texture = useTexture(backgroundImage);

  const getSize = (texture: Texture, size: Size) => {
    const imageAspect = texture.image.width / texture.image.height;
    const viewportAspect = size.width / size.height;

    if (imageAspect > viewportAspect) {
      // Image is wider than viewport
      return size.height / texture.image.height;
    } else {
      // Image is taller than viewport
      return size.width / texture.image.width;
    }
  };

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.tex.value = texture;
    }
    return () => {};
  }, [texture]);

  useEffect(() => {
    if (materialRef.current && texture.image) {
      const imageAspect = texture.image.width / texture.image.height;
      const viewportAspect = size.width / size.height;

      materialRef.current.uniforms.imageAspect.value = imageAspect;
      materialRef.current.uniforms.viewportAspect.value = viewportAspect;
      materialRef.current.uniforms.aspect.value = getSize(texture, size);
      materialRef.current.uniforms.pixelRatio.value = pixelRatio;
      materialRef.current.uniforms.resolution.value.set(
        size.width * pixelRatio,
        size.height * pixelRatio,
      );
    }
  }, [size, pixelRatio, texture, viewport]);

  useFrame(({clock, pointer}) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.mouse.value.set(
        pointer.x * 0.5 + 0.5,
        pointer.y * 0.5 + 0.5,
        mousePressed,
      );
      materialRef.current.uniforms.tex.value = texture;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <rainMaterial ref={materialRef} />
    </mesh>
  );
};

export default RainEffect;
