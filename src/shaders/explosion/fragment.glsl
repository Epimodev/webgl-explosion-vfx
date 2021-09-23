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

float quadraticCircle(vec2 coordinate) {
  float centerDistance = distance(coordinate, vec2(0.5));
  float quadraticDistance = pow(centerDistance, 2.0);
  return 1.0 - quadraticDistance;
}

void main() {
  float circle = quadraticCircle(v_uv);
  circle = invLerp(0.8, 1.0, circle);
  vec3 color = vec3(circle);

  gl_FragColor = vec4(color, 1.0);
}
