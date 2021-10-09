# WebGL Explosion VFX

## Presentation

This project is the source code of an explosion animation you can try here: https://webgl-explosion-vfx.vercel.app/  

It was inspired by this Blender VFX tutorial made by [@pierrick_picaut](https://twitter.com/pierrick_picaut): https://www.youtube.com/watch?v=36Fmx_2KO74  

The goal of this project was to create this effect as close as I can in WebGL.  

The result is not as good as the effect shown in the tutorial because I had performance issues on my laptop and phone, mainly due to running the noise algorithm on many meshes. But maybe it's because I missed some performance optimizations.

## Techonoly used

- [three.js](https://github.com/mrdoob/three.js)
- [glslx](https://github.com/evanw/glslx)
- [stats.js](https://github.com/mrdoob/stats.js)
- [tweakpane](https://github.com/cocopon/tweakpane)
- [vite](https://github.com/vitejs/vite)
- [TypeScript](https://github.com/microsoft/TypeScript)

## Run the project on your computer

```sh
# clone project
git clone git@github.com:Epimodev/webgl-explosion-vfx.git
cd webgl-explosion-vfx
# install dependencies
yarn install
# run dev server
yarn dev
# the app should be accessible at localhost:3000
```

## Credits

- Tutorial that inspired this project [Explosion VFX tutorial in Blender](https://www.youtube.com/watch?v=36Fmx_2KO74) by [@pierrick_picaut](https://twitter.com/pierrick_picaut)
- Noise algorithm from [shadertoy](http://www.shadertoy.com/view/XsX3zB) by Nikita Miropolskiy
- Favicon made by [Victoruler](https://www.flaticon.com/fr/auteurs/victoruler)
