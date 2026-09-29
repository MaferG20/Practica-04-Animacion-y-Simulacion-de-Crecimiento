# Practica 04 - Crecimiento de Planta 3D

## Descripcion del proyecto

Este proyecto consiste en el desarrollo de un simulador interactivo de crecimiento vegetal utilizando **Three.js** y **WebGL**.

La escena representa un entorno botanico dentro de un invernadero, donde se encuentran nueve tulipanes distribuidos en una cuadricula. Cada planta cuenta con diferentes elementos 3D, como maceta, tierra, tallo, hojas y flor.

El proyecto permite observar el crecimiento progresivo de los tulipanes mediante animaciones en tiempo real. Ademas, las hojas reaccionan a un efecto de viento generado mediante shaders personalizados en **GLSL**.

La aplicacion cuenta con una interfaz de controles que permite modificar diferentes parametros de la simulacion, pausar o reanudar la animacion, reiniciar el crecimiento, cambiar colores y controlar la camara.

## Objetivo

El objetivo de esta practica es aplicar los conceptos de animacion 3D, transformaciones, jerarquia de objetos y shaders personalizados dentro de una escena interactiva desarrollada con Three.js.

La simulacion busca representar de forma visual el proceso de crecimiento de un tulipan, comenzando desde una escala minima y desarrollando progresivamente el tallo, las hojas y finalmente la flor.

Tambien se busca simular el movimiento natural de las hojas mediante un efecto de viento controlable por el usuario.

## Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript
* Three.js
* WebGL
* GLSL
* OrbitControls
* Raycasting
* Visual Studio Code
* Live Server

## Estructura del proyecto
practica-04-crecimiento/
|
├── index.html
├── style.css
├── main.js
|
├── shaders/
│   ├── wind.vert
│   └── wind.frag
|
└── captura.png

### Descripcion de los archivos
**index.html**
Contiene la estructura HTML de la aplicacion. Incluye el titulo del proyecto, el panel de informacion y todos los controles utilizados para interactuar con la simulacion.
**style.css**
Contiene los estilos visuales de la aplicacion. Define la apariencia de los paneles, botones, controles, barra de progreso y elementos de informacion.
**main.js**
Contiene la logica principal del proyecto. En este archivo se crea la escena 3D, la camara, la iluminacion, los tulipanes, el invernadero, las animaciones, los controles y el sistema de raycasting.
**shaders/wind.vert**
Contiene el Vertex Shader utilizado para generar el movimiento de los vertices de las hojas mediante una funcion senoidal.
**shaders/wind.frag**
Contiene el Fragment Shader utilizado para controlar el color y la iluminacion de los elementos que utilizan el material personalizado.
**captura.png**
Contiene la evidencia visual del proyecto funcionando.

## Escena 3D
La escena esta compuesta por un entorno botanico que incluye un suelo, un invernadero y nueve tulipanes.
Cada tulipan esta formado por diferentes objetos geometricos:
* Maceta.
* Tierra.
* Tallo.
* Hojas.
* Centro de la flor.
* Petalos.
Tambien se utilizan diferentes tipos de geometria de Three.js, como:
* `CylinderGeometry`
* `SphereGeometry`
* `ConeGeometry`
* `PlaneGeometry`
Esto permite cumplir con el requisito de utilizar diferentes tipos de geometria dentro de la escena.
## Organizacion jerarquica de las plantas
Para controlar el crecimiento de las diferentes partes del tulipan se utilizan objetos `THREE.Group`.
La estructura principal de cada planta es:
Planta
|
└── Tallo
    |
    ├── Hojas
    |
    └── Flor
        |
        └── Petalos

Esta jerarquia permite modificar de manera independiente la escala, rotacion y posicion de cada parte de la planta.
En este proyecto se utiliza una estructura adaptada a la anatomia de un tulipan. Por esta razon no se agregan ramas, ya que el tulipan utilizado en la simulacion cuenta principalmente con un tallo, hojas y una flor.
## Simulacion del crecimiento
El crecimiento de las plantas se controla mediante una variable de progreso que representa el avance de la simulacion.
El progreso va desde `0` hasta `1`.
El crecimiento se divide en diferentes etapas:
### Etapa 1 - Crecimiento del tallo
El tallo comienza con una escala vertical cercana a cero y aumenta progresivamente hasta alcanzar su tamano final.
### Etapa 2 - Crecimiento de las hojas
Una vez iniciado el crecimiento del tallo, las hojas comienzan a aparecer y aumentan progresivamente de tamano.
### Etapa 3 - Crecimiento de la flor
Finalmente comienza el crecimiento de la flor. Los petalos aumentan progresivamente de tamano y realizan una apertura para representar el desarrollo de la flor.
Esta secuencia permite representar visualmente un proceso de crecimiento vegetal.
## Animacion con requestAnimationFrame
La animacion principal del proyecto utiliza:
requestAnimationFrame(animar);
Esta funcion permite ejecutar continuamente el ciclo de animacion y actualizar los elementos de la escena.

Durante cada ciclo se actualizan:

* El progreso de crecimiento.
* La escala del tallo.
* La escala de las hojas.
* La escala de la flor.
* La apertura de los petalos.
* El movimiento producido por el viento.
* Los valores de los shaders.
* Los controles de la camara.
* El renderizado de la escena.

## Efecto de viento mediante GLSL
Una de las caracteristicas principales de la practica es la implementacion de un efecto de viento utilizando shaders personalizados.
El proyecto utiliza dos archivos:
wind.vert
wind.frag

### Vertex Shader
El archivo `wind.vert` modifica la posicion de los vertices de los objetos para generar un movimiento oscilatorio.
El movimiento utiliza una funcion seno:
float despl = sin(uTime * 2.2) * 0.06 * uWind * factorAltura;
El valor `uTime` permite controlar el movimiento con respecto al tiempo, mientras que `uWind` controla la intensidad del viento.
De esta manera, las hojas pueden balancearse continuamente durante la simulacion.
### Fragment Shader
El archivo `wind.frag` controla la apariencia visual de los objetos que utilizan el shader.
Se utiliza el uniforme:
uniform vec3 uColor;
Esto permite modificar el color de las hojas y los petalos desde JavaScript.
## Controles interactivos
La aplicacion cuenta con diferentes controles HTML.
### Velocidad de crecimiento
Permite aumentar o disminuir la velocidad con la que crecen los tulipanes.
### Intensidad del viento
Permite modificar la intensidad del movimiento de las hojas.
### Intensidad de luz
Permite controlar la iluminacion general de la escena.
### Reiniciar crecimiento
Regresa el progreso de crecimiento a cero para comenzar nuevamente la simulacion.
### Pausar / Reanudar
Permite detener temporalmente la animacion y continuarla posteriormente.
### Cambiar color de hojas
Permite cambiar el color utilizado para representar las hojas.
### Cambiar color de petalos
Permite modificar el color de las flores.
### Ocultar hojas
Permite mostrar u ocultar las hojas de los tulipanes.
### Reiniciar camara
Regresa la camara a su posicion inicial para recuperar la vista original de la escena.
## Camara y navegacion
La escena utiliza una camara:
THREE.PerspectiveCamera
Tambien se utilizan `OrbitControls` para permitir la interaccion con la camara.
El usuario puede:
* Rotar la vista.
* Acercarse a las plantas.
* Alejarse.
* Observar el invernadero desde diferentes posiciones.
Los controles cuentan con damping para generar una navegacion mas suave.
## Iluminacion
La escena utiliza diferentes fuentes de iluminacion para mejorar la visualizacion de los objetos 3D.
Se utilizan:
* `AmbientLight`
* `DirectionalLight`
La luz direccional tambien permite generar sombras sobre el suelo y las macetas.
La intensidad de la iluminacion puede modificarse mediante el control correspondiente de la interfaz.
## Invernadero
Como parte del entorno visual se incorporo una estructura de invernadero alrededor del jardin.
El invernadero esta construido mediante elementos geometricos que representan la estructura del espacio.
Su funcion principal es proporcionar un ambiente visual relacionado con el crecimiento vegetal y la simulacion botanica.
El frente del invernadero permanece abierto para facilitar la visualizacion de las plantas y la interaccion con ellas.
## Raycasting e informacion de los objetos
El proyecto implementa un sistema de **Raycasting** para detectar los objetos cuando el usuario hace clic sobre ellos.
Al seleccionar una parte de una planta se muestra informacion relacionada con el objeto seleccionado.
La interfaz puede mostrar:
* Nombre del objeto.
* Tipo de geometria.
* Porcentaje de crecimiento.
Esto permite utilizar la escena como un visor interactivo con finalidad educativa.
## Interfaz de usuario
La interfaz esta organizada en diferentes secciones:
### Panel superior
Muestra el titulo del proyecto y una breve descripcion.
### Panel de informacion
Muestra los datos del objeto seleccionado mediante raycasting.
### Panel de controles
Contiene los sliders y botones utilizados para modificar la simulacion.
Tambien incluye una barra de progreso que permite observar el porcentaje de crecimiento de las plantas.
## Ejecucion del proyecto

El proyecto debe ejecutarse mediante un servidor local debido a que los shaders se cargan utilizando `fetch()`.

Para ejecutar el proyecto:

1. Abrir la carpeta `practica-04-crecimiento` en Visual Studio Code.
2. Verificar que `index.html`, `style.css` y `main.js` se encuentren en la carpeta principal.
3. Verificar que los archivos `wind.vert` y `wind.frag` se encuentren dentro de la carpeta `shaders`.
4. Abrir el archivo `index.html`.
5. Ejecutar **Live Server**.
6. Abrir la pagina que proporciona el servidor local.
7. Interactuar con los controles y la escena 3D.

No se recomienda abrir `index.html` directamente con doble clic, ya que los archivos de shader pueden no cargarse correctamente mediante `file://`.

## Resultados

El resultado final es una escena 3D interactiva en la que nueve tulipanes crecen progresivamente dentro de un invernadero.

El usuario puede modificar diferentes parametros de la simulacion en tiempo real y observar los cambios directamente en la escena.

El proyecto integra animacion, transformaciones, jerarquia de objetos, iluminacion, controles de camara, raycasting y shaders personalizados.


## Evidencia

La evidencia del proyecto se encuentra en:
captura.png

La captura muestra la escena 3D funcionando, los tulipanes dentro del invernadero y la interfaz de controles.
## Conclusion

La practica permitio aplicar conceptos fundamentales de graficos 3D y animacion en tiempo real utilizando Three.js.

Mediante el uso de `THREE.Group` se logro organizar jerarquicamente las partes de los tulipanes y controlar su crecimiento de manera independiente.

El uso de `requestAnimationFrame` permitio crear una animacion continua, mientras que los shaders personalizados en GLSL permitieron implementar un efecto de viento sobre las hojas.

Finalmente, la incorporacion de controles HTML, OrbitControls y Raycasting permitio convertir la escena en una experiencia interactiva y educativa relacionada con la simulacion del crecimiento vegetal.
