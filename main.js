import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// CARGA DE SHADERS
async function cargarShaders() {
  const [vertCode, fragCode] = await Promise.all([
    fetch('./shaders/wind.vert').then(res => res.text()),
    fetch('./shaders/wind.frag').then(res => res.text())
  ]);
  return { vertCode, fragCode };
}

// funcion principal de inicialización
async function init() {
  const { vertCode, fragCode } = await cargarShaders();

  // 1. ESCENA, CAMARA Y RENDERER
  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0xbfe3df);
  escena.fog = new THREE.Fog(0xbfe3df, 20, 55);

  const camara = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camara.position.set(0, 10, 16);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Canvas al fondo
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '0';

  // Sombras suaves
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // CAPA PARA CONTROLAR LA OSCURIDAD DE TODA LA ESCENA
  const capaOscura = document.createElement('div');
  capaOscura.id = 'capaOscura';
  Object.assign(capaOscura.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    background: '#000000', opacity: '0', pointerEvents: 'none', zIndex: '1'
  });
  document.body.appendChild(capaOscura);

  // CONTROLES DE INTERFAZ POR ENCIMA DE LA CAPA OSCURA
  ['controles', 'info', 'titulo'].forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.style.zIndex = '10';
  });

  // controles de camara
  const controles = new OrbitControls(camara, renderer.domElement);
  controles.enableDamping = true;
  controles.target.set(0, 2.5, 0);

  // ILUMINACION
  const luzAmbiente = new THREE.AmbientLight(0xffffff, 1.15);
  const luzDireccional = new THREE.DirectionalLight(0xffffff, 0.9);
  luzDireccional.position.set(10, 18, 12);
  luzDireccional.castShadow = true;
  luzDireccional.shadow.mapSize.width = 2048;
  luzDireccional.shadow.mapSize.height = 2048;
  escena.add(luzAmbiente, luzDireccional);

  // Pasto
  const suelo = new THREE.Mesh(
    new THREE.PlaneGeometry(32, 32),
    new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 })
  );
  suelo.rotation.x = -Math.PI / 2;
  suelo.receiveShadow = true;
  escena.add(suelo);
    
  // INVERNADERO 
  const invernaderoGroup = new THREE.Group();
  // Dimensiones del invernadero
  const anchoInvernadero = 32;
  const fondoInvernadero = 32;
  const altoInvernadero = 18;
  // Material de la estructura
  const materialEstructura = new THREE.MeshStandardMaterial({
    color: 0x6b7280,
    metalness: 0.5,
    roughness: 0.35
  });
  // Material transparente para las paredes y techo
  const materialCristal = new THREE.MeshPhysicalMaterial({
    color: 0xdff7ff,
    transparent: true,
    opacity: 0.10,
    roughness: 0.05,
    metalness: 0,
    transmission: 0.15,
    side: THREE.DoubleSide
  });
  // POSTES VERTICALES
  const posicionesPostes = [
    [-anchoInvernadero / 2, -fondoInvernadero / 2],
    [ anchoInvernadero / 2, -fondoInvernadero / 2],
    [-anchoInvernadero / 2,  fondoInvernadero / 2],
    [ anchoInvernadero / 2,  fondoInvernadero / 2]
  ];

  posicionesPostes.forEach(([x, z]) => {

    const poste = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, altoInvernadero, 0.25),
      materialEstructura
    );

    poste.position.set(
      x,
      altoInvernadero / 2,
      z
    );

    poste.castShadow = true;
    invernaderoGroup.add(poste);

  });
  // POSTES LATERALES INTERMEDIOS
  const postesLaterales = [
    [-anchoInvernadero / 2, 0],
    [ anchoInvernadero / 2, 0],
    [0, -fondoInvernadero / 2],
    [0, fondoInvernadero / 2]
  ];

  postesLaterales.forEach(([x, z]) => {

    const poste = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, altoInvernadero, 0.18),
      materialEstructura
    );

    poste.position.set(
      x,
      altoInvernadero / 2,
      z
    );
    invernaderoGroup.add(poste);
  });

  // MARCO SUPERIOR
  const marcoFrontal = new THREE.Mesh(
    new THREE.BoxGeometry(anchoInvernadero, 0.25, 0.25),
    materialEstructura
  );
  marcoFrontal.position.set(
    0,
    altoInvernadero,
    -fondoInvernadero / 2
  );
  invernaderoGroup.add(marcoFrontal);
  const marcoTrasero = new THREE.Mesh(
    new THREE.BoxGeometry(anchoInvernadero, 0.25, 0.25),
    materialEstructura
  );
  marcoTrasero.position.set(
    0,
    altoInvernadero,
    fondoInvernadero / 2
  );
  invernaderoGroup.add(marcoTrasero);
  const marcoLateralIzq = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.25, fondoInvernadero),
    materialEstructura
  );

  marcoLateralIzq.position.set(
    -anchoInvernadero / 2,
    altoInvernadero,
    0
  );
  invernaderoGroup.add(marcoLateralIzq);
  const marcoLateralDer = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.25, fondoInvernadero),
    materialEstructura
  );

  marcoLateralDer.position.set(
    anchoInvernadero / 2,
    altoInvernadero,
    0
  );
  invernaderoGroup.add(marcoLateralDer);
  // TECHO TIPO INVERNADERO
  const techoInvernadero = new THREE.Mesh(
    new THREE.BoxGeometry(
      anchoInvernadero,
      0.12,
      fondoInvernadero
    ),
    materialCristal
  );
  techoInvernadero.position.set(0, altoInvernadero,0
  );
  techoInvernadero.receiveShadow = true;
  invernaderoGroup.add(techoInvernadero);
  // PAREDES LATERALES TRANSPARENTES
  const paredIzquierda = new THREE.Mesh(
    new THREE.PlaneGeometry(
      fondoInvernadero,
      altoInvernadero
    ),
    materialCristal
  );
  paredIzquierda.rotation.y = Math.PI / 2;
  paredIzquierda.position.set(  -anchoInvernadero / 2,altoInvernadero / 2,0
  );
  invernaderoGroup.add(paredIzquierda);
  const paredDerecha = new THREE.Mesh(new THREE.PlaneGeometry( fondoInvernadero, altoInvernadero
    ),
    materialCristal
  );
  paredDerecha.rotation.y = -Math.PI / 2;
  paredDerecha.position.set( anchoInvernadero / 2, altoInvernadero / 2, 0
  );
  invernaderoGroup.add(paredDerecha);
  // PARED TRASERA
  const paredTrasera = new THREE.Mesh(new THREE.PlaneGeometry(anchoInvernadero,altoInvernadero
    ),
    materialCristal
  );
  paredTrasera.position.set(0,altoInvernadero / 2,fondoInvernadero / 2
  );
  paredTrasera.rotation.y = Math.PI;
  invernaderoGroup.add(paredTrasera);
  // AGREGAR INVERNADERO A LA ESCENA
  escena.add(invernaderoGroup);

  // 2. PALETA DE COLORES TULIPANES Y SHADER DE HOJAS
  const coloresTulipanes = [
    new THREE.Color(0xc77dff), // Violeta Neón
    new THREE.Color(0x00f4fa), // Cyan Neón 
    new THREE.Color(0x2979ec), // Azul Vivo
    new THREE.Color(0xffd600), // Amarillo Sol
    new THREE.Color(0xff00c8), // Magenta Brillante
    new THREE.Color(0xffc4a3), // durazno
    new THREE.Color(0xff0066), // Rosa Carmín
    new THREE.Color(0xffff00), // Amarillo Puro
    new THREE.Color(0xff1493)  // Rosa DeepPink
  ];

  // shader de hojas 
  const colorVerdeVivo = new THREE.Color(0x2ecc71);
  const shaderHojas = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uWind: { value: 1.0 },
      uColor: { value: colorVerdeVivo }
    },
    vertexShader: vertCode,
    fragmentShader: fragCode,
    side: THREE.DoubleSide
  });

  // 3. CONSTRUCCION DE JARDIN 9 TULIPANES
  const tulipanesLista = [];
  const jardinGroup = new THREE.Group();
  escena.add(jardinGroup);

  let colorIdx = 0;
  const pasoX = 3.2, pasoZ = 3.2;

  for (let fila = -1; fila <= 1; fila++) {
    for (let col = -1; col <= 1; col++) {
      const posX = col * pasoX;
      const posZ = fila * pasoZ;

      // grupo de planta
      const plantaGroup = new THREE.Group();
      plantaGroup.position.set(posX, 0.7, posZ);

      // MACETA
      const maceta = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.5, 1.2, 24),
        new THREE.MeshStandardMaterial({ color: 0xe06d53, roughness: 0.5 })
      );
      maceta.position.y = -0.1;
      maceta.castShadow = true;
      maceta.userData = { nombre: 'Maceta de Ceramica', fase: 'base', geometria: 'Cilindro geometrico' };
      plantaGroup.add(maceta);

      // TIERRA
      const tierra = new THREE.Mesh(
        new THREE.CylinderGeometry(0.66, 0.61, 0.1, 24),
        new THREE.MeshStandardMaterial({ color: 0x3d1d11, roughness: 0.95 })
      );
      tierra.position.y = 0.48;
      tierra.userData = { nombre: 'Tierra', fase: 'base', geometria: 'Cilindro geometrico' };
      plantaGroup.add(tierra);

      // SHADER PROPIO DE PETALOS
      const colorPetalo = coloresTulipanes[colorIdx % coloresTulipanes.length];
      colorIdx++;

      const shaderPetaloIndividual = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uWind: { value: 1.0 },
          uColor: { value: colorPetalo.clone() }
        },
        vertexShader: vertCode,
        fragmentShader: fragCode,
        side: THREE.DoubleSide
      });

      // TALLO
      const talloGroup = new THREE.Group();
      const geomTallo = new THREE.CylinderGeometry(0.06, 0.08, 3.8, 16);
      geomTallo.translate(0, 1.9, 0);

      const talloMesh = new THREE.Mesh(
        geomTallo,
        new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.4 })
      );
      talloMesh.castShadow = true;
      talloMesh.userData = { nombre: `Tallo Tulipan #${colorIdx}`, fase: 'tallo', geometria: 'Cilindro geometrico' };
      talloGroup.add(talloMesh);
      plantaGroup.add(talloGroup);

      // HOJAS
      const hojasGroup = new THREE.Group();
      talloGroup.add(hojasGroup);

      const configHojas = [
        { rotY: 0, rotZ: -0.32, posY: 0.5 },
        { rotY: Math.PI * 0.8, rotZ: -0.35, posY: 0.9 }
      ];

      configHojas.forEach((conf, i) => {
        const hojaNodo = new THREE.Group();
        hojaNodo.position.y = conf.posY;
        hojaNodo.rotation.y = conf.rotY;

        const geomHoja = new THREE.ConeGeometry(0.42, 2.4, 16);
        geomHoja.translate(0, 1.2, 0);
        geomHoja.scale(0.65, 1, 0.2);

        const hojaMesh = new THREE.Mesh(geomHoja, shaderHojas);
        hojaMesh.rotation.z = conf.rotZ;
        hojaMesh.castShadow = true;
        hojaMesh.userData = { nombre: `Hoja ${i + 1}`, fase: 'hojas', geometria: 'Cono geometrico' };

        hojaNodo.add(hojaMesh);
        hojasGroup.add(hojaNodo);
      });

      // FLOR DEL TULIPAN
      const florGroup = new THREE.Group();
      florGroup.position.y = 3.8;
      talloGroup.add(florGroup);

      // CENTRO  (Pistilo)
      const calizMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.1 })
      );
      calizMesh.userData = { nombre: 'Centro  Pistilo', fase: 'flor', geometria: 'Esfera Geometrica' };
      florGroup.add(calizMesh);

      // PETALOS
      const petalosList = [];
      const numPetalos = 6;

      for (let i = 0; i < numPetalos; i++) {
        const angulo = (i * Math.PI * 2) / numPetalos;
        const petaloPivot = new THREE.Group();
        petaloPivot.rotation.y = angulo;

        const geomPetalo = new THREE.SphereGeometry(0.48, 16, 16, 0, Math.PI);
        geomPetalo.scale(0.7, 1.5, 0.25);
        geomPetalo.translate(0, 0.75, 0.2);

        const petaloMesh = new THREE.Mesh(geomPetalo, shaderPetaloIndividual);
        petaloMesh.castShadow = true;
        petaloMesh.userData = { nombre: `Petalo #${i + 1}`, fase: 'flor', geometria: 'Esfera Geometrica' };

        petaloPivot.add(petaloMesh);
        florGroup.add(petaloPivot);
        petalosList.push(petaloMesh);
      }

      jardinGroup.add(plantaGroup);
      tulipanesLista.push({ talloGroup, hojasGroup, florGroup, petalosList, shaderPetaloIndividual });
    }
  }

  // 4. ANIMACION Y SINCRONIZACION DE VIENTO
  let progresoGlobal = 0, animacionActiva = true, velocidadCrecimiento = 1.0, intensidadViento = 1.0, tiempo = 0;
  const reloj = new THREE.Clock();

  function obtenerProgresoFase(fase) {
    if (fase === 'tallo') return THREE.MathUtils.clamp(progresoGlobal / 0.45, 0, 1);
    if (fase === 'hojas') return THREE.MathUtils.clamp((progresoGlobal - 0.25) / 0.35, 0, 1);
    if (fase === 'flor') return THREE.MathUtils.clamp((progresoGlobal - 0.55) / 0.45, 0, 1);
    return 1.0;
  }

  function animar() {
    requestAnimationFrame(animar);
    const delta = reloj.getDelta();

    if (animacionActiva) {
      tiempo += delta;
      shaderHojas.uniforms.uTime.value = tiempo;
      shaderHojas.uniforms.uWind.value = intensidadViento;
      progresoGlobal += velocidadCrecimiento * delta * 0.15;
      progresoGlobal = Math.min(progresoGlobal, 1.0);
    }

    const pctInt = Math.round(progresoGlobal * 100);
    document.getElementById('valProgreso').textContent = `${pctInt}%`;
    document.getElementById('progressBar').style.width = `${pctInt}%`;

    const pTallo = obtenerProgresoFase('tallo');
    const pHojas = obtenerProgresoFase('hojas');
    const pFlor = obtenerProgresoFase('flor');

    const anguloVientoZ = Math.sin(tiempo * 2.2) * 0.04 * intensidadViento;
    const anguloVientoX = Math.cos(tiempo * 1.8) * 0.02 * intensidadViento;

    tulipanesLista.forEach(tulip => {
      tulip.talloGroup.scale.set(1, pTallo, 1);
      tulip.hojasGroup.scale.setScalar(pHojas);
      tulip.florGroup.scale.setScalar(pFlor);

      tulip.shaderPetaloIndividual.uniforms.uTime.value = tiempo;
      tulip.shaderPetaloIndividual.uniforms.uWind.value = intensidadViento;

      const apertura = THREE.MathUtils.lerp(0.02, 0.3, Math.max(0, (pFlor - 0.4) * 1.6));
      tulip.petalosList.forEach(p => { p.rotation.x = apertura; });

      if (animacionActiva) {
        tulip.talloGroup.rotation.z = anguloVientoZ;
        tulip.talloGroup.rotation.x = anguloVientoX;
      }
    });

    controles.update();
    renderer.render(escena, camara);
  }

  // 5. RAYCASTING INTERACTIVO
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('click', evento => {
    if (evento.target.closest('#controles, #info, #titulo')) return;

    mouse.x = (evento.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(evento.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camara);
    const intersecciones = raycaster.intersectObjects(jardinGroup.children, true);

    const infoDesc = document.getElementById('info-desc');
    const infoDetalles = document.getElementById('info-detalles');

    if (intersecciones.length > 0) {
      const objeto = intersecciones[0].object;
      const datos = objeto.userData;

      if (datos && datos.nombre) {
        const progresoPct = Math.round(obtenerProgresoFase(datos.fase) * 100);
        document.getElementById('info-nombre').textContent = datos.nombre;
        document.getElementById('info-geom').textContent = datos.geometria;
        document.getElementById('info-pct').textContent = `${progresoPct}%`;
        infoDesc.style.display = 'none';
        infoDetalles.style.display = 'block';
      }
    } else {
      infoDesc.style.display = 'block';
      infoDetalles.style.display = 'none';
    }
  });

  // 6. EVENTOS DE UI
  document.getElementById('btnPausarAnimacion').addEventListener('click', e => {
    animacionActiva = !animacionActiva;
    e.target.textContent = animacionActiva ? 'Detener Animacion' : 'Reanudar Animacion';
  });

  document.getElementById('btnReiniciarCrecimiento').addEventListener('click', () => {
    progresoGlobal = 0;
    animacionActiva = true;
    document.getElementById('btnPausarAnimacion').textContent = 'Detener Animacion';
  });

  document.getElementById('velocidadCrecimiento').addEventListener('input', e => {
    velocidadCrecimiento = parseFloat(e.target.value);
    document.getElementById('valVelocidad').textContent = `${velocidadCrecimiento.toFixed(1)}x`;
  });

  document.getElementById('intensidadViento').addEventListener('input', e => {
    intensidadViento = parseFloat(e.target.value);
    document.getElementById('valViento').textContent = intensidadViento.toFixed(1);
  });

  // INTENSIDAD DE LUZ
  document.getElementById('intensidadLuz').addEventListener('input', e => {
    const val = parseFloat(e.target.value);
    luzDireccional.intensity = val;
    luzAmbiente.intensity = val * 0.17;

    const oscuridad = THREE.MathUtils.clamp(1 - (val / 1.5), 0, 1);
    capaOscura.style.opacity = Math.pow(oscuridad, 1.5);
    document.getElementById('valLuz').textContent = val.toFixed(1);
  });

  let hojasVisibles = true;
  document.getElementById('btnOcultarHojas').addEventListener('click', e => {
    hojasVisibles = !hojasVisibles;
    tulipanesLista.forEach(t => { t.hojasGroup.visible = hojasVisibles; });
    e.target.textContent = hojasVisibles ? 'Ocultar Hojas' : 'Mostrar Hojas';
  });

  const paletaHojas = [0x2ecc71, 0x00e676, 0x81c784, 0x11998e];
  let idxHojaColor = 0;

  document.getElementById('btnColorHojas').addEventListener('click', () => {
    idxHojaColor = (idxHojaColor + 1) % paletaHojas.length;
    shaderHojas.uniforms.uColor.value.setHex(paletaHojas[idxHojaColor]);
  });

  document.getElementById('btnColorPetalos').addEventListener('click', () => {
    tulipanesLista.forEach(t => {
      const nuevoColor = coloresTulipanes[Math.floor(Math.random() * coloresTulipanes.length)];
      t.shaderPetaloIndividual.uniforms.uColor.value.copy(nuevoColor);
    });
  });

  document.getElementById('btnReiniciarCamara').addEventListener('click', () => {
    camara.position.set(0, 10, 16);
    controles.target.set(0, 2.5, 0);
    controles.update();
  });

  window.addEventListener('resize', () => {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animar();
}

init();