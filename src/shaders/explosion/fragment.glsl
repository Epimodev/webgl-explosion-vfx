precision mediump float;

uniform float u_time;

varying vec2 v_uv;

float lerp(float min, float max, float value) {
  return (max - min) * value + min;
}

float invLerp(float min, float max, float value) {
  return (value - min) / (max - min);
}

float remap(float inputMin, float inputMax, float outputMin, float outputMax, float value) {
  float t = invLerp(inputMin, inputMax, value);
  return lerp(outputMin, outputMax, t);
}

// 	<www.shadertoy.com/view/XsX3zB>
//	by Nikita Miropolskiy

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
  float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
  vec3 r;
  r.z = fract(512.0*j);
  j *= .125;
  r.x = fract(512.0*j);
  j *= .125;
  r.y = fract(512.0*j);
  return r-0.5;
}

const float F3 =  0.3333333;
const float G3 =  0.1666667;
float snoise(vec3 p) {

  vec3 s = floor(p + dot(p, vec3(F3)));
  vec3 x = p - s + dot(s, vec3(G3));

  vec3 e = step(vec3(0.0), x - x.yzx);
  vec3 i1 = e*(1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy*(1.0 - e);

  vec3 x1 = x - i1 + G3;
  vec3 x2 = x - i2 + 2.0*G3;
  vec3 x3 = x - 1.0 + 3.0*G3;

  vec4 w, d;

  w.x = dot(x, x);
  w.y = dot(x1, x1);
  w.z = dot(x2, x2);
  w.w = dot(x3, x3);

  w = max(0.6 - w, 0.0);

  d.x = dot(random3(s), x);
  d.y = dot(random3(s + i1), x1);
  d.z = dot(random3(s + i2), x2);
  d.w = dot(random3(s + 1.0), x3);

  w *= w;
  w *= w;
  d *= w;

  return dot(d, vec4(52.0));
}

float snoiseFractal(vec3 m) {
  float value = 0.5333333 * snoise(m)
              + 0.2666667 * snoise(2.0*m)
              + 0.1333333 * snoise(4.0*m)
              + 0.0666667 * snoise(8.0*m);
  return invLerp(-1.45, 0.35, value);
}

float quadraticCircle(vec2 coordinate) {
  float centerDistance = distance(coordinate, vec2(0.5));
  float quadraticDistance = pow(centerDistance, 2.0);
  return 1.0 - quadraticDistance;
}

void main() {
  float noiseFac = snoiseFractal(vec3(v_uv * 5.0, u_time));
  float circle = quadraticCircle(v_uv);
  circle = invLerp(0.8, 1.0, circle);
  vec3 color = vec3(noiseFac);

  gl_FragColor = vec4(color, 1.0);
}
