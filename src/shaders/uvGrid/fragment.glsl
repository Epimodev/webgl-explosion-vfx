precision mediump float;

uniform float u_scale;
uniform vec3 u_color1;
uniform vec3 u_color2;

varying vec2 v_uv;

const float smoothness = 0.01;

void main() {
  float rows_shades = floor(fract(v_uv.y) * u_scale) / u_scale;
  float x = v_uv.x + rows_shades; // offset x column depending on row index
  float squares = step(0.5, fract(x * u_scale / 2.0));

  vec3 color = mix(u_color1, u_color2, squares);

  gl_FragColor = vec4(color, 1);
}
