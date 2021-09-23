precision mediump float;

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

void main() {
  float circle_gradient = 1.0 - distance(v_uv, vec2(0.5));
  float circle = invLerp(0.5, 1.0, circle_gradient);
  vec3 color = vec3(0, 0, 0);
  float alpha = circle;

  gl_FragColor = vec4(color, alpha);
}
