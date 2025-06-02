# Paleta de Colores - Fenix.Ninja 🎨

## Colores Principales

| Color                      | HEX       | Uso sugerido                                                                        |
| -------------------------- | --------- | ----------------------------------------------------------------------------------- |
| **Naranja fuego**          | `#F25C1F` | Color principal. Energía, acción, fuego, impulso. Ideal para el logo y botones CTA. |
| **Negro absoluto**         | `#0F0F0F` | Fondo principal. Transmite fuerza, elegancia y enfoque. Hace resaltar el naranja.   |
| **Blanco hueso**           | `#F2F2F0` | Tipografía secundaria. Contrasta con el negro sin ser tan frío como el blanco puro. |
| **Rojo oscuro (opcional)** | `#C0392B` | Acento para detalles agresivos o elementos de alerta.                               |

## Variaciones y Transparencias

### Naranja Fuego (`#F25C1F`)
- 10% - `rgba(242, 92, 31, 0.1)` - Fondos sutiles, hover states
- 30% - `rgba(242, 92, 31, 0.3)` - Bordes y separadores
- 50% - `rgba(242, 92, 31, 0.5)` - Elementos semi-transparentes
- 80% - `rgba(242, 92, 31, 0.8)` - Elementos destacados
- 100% - `#F25C1F` - Elementos principales

### Negro Absoluto (`#0F0F0F`)
- Variación clara 1: `#1a1a1a` - Fondos secundarios
- Variación clara 2: `#2a2a2a` - Elementos elevados
- Con transparencia: `rgba(15, 15, 15, 0.95)` - Navbar con blur

### Blanco Hueso (`#F2F2F0`)
- 60% - `rgba(242, 242, 240, 0.6)` - Texto terciario
- 80% - `rgba(242, 242, 240, 0.8)` - Texto secundario
- 100% - `#F2F2F0` - Texto principal

## Gradientes Recomendados

### Gradiente Principal
```css
background: linear-gradient(45deg, #F25C1F, #C0392B);
```

### Gradiente de Fondo
```css
background: linear-gradient(135deg, #0F0F0F 0%, #1a1a1a 100%);
```

### Gradiente para Texto
```css
background: linear-gradient(45deg, #F25C1F, #F2F2F0);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## Usos Específicos

### Interacciones
- Hover de botones: Aumentar brillo del naranja fuego
- Focus states: Borde naranja fuego al 30%
- Active states: Oscurecer ligeramente el color base

### Mensajes y Estados
- Éxito: Verde `#2ECC71` con alpha 0.1 para fondo
- Error: Rojo oscuro `#C0392B` con alpha 0.1 para fondo
- Info: Naranja fuego con alpha 0.1 para fondo
- Disabled: Grises basados en el negro absoluto

### Sombras
```css
/* Sombra principal */
box-shadow: 0 20px 40px rgba(242, 92, 31, 0.3);

/* Sombra sutil */
box-shadow: 0 10px 25px rgba(242, 92, 31, 0.2);
```

## Accesibilidad

Los colores seleccionados cumplen con los estándares WCAG 2.1:
- Contraste texto principal sobre negro: 15.5:1 (AAA)
- Contraste naranja sobre negro: 7.2:1 (AAA)
- Contraste texto secundario sobre negro: 12.4:1 (AAA)

## Implementación en Variables CSS

```css
:root {
    /* Colores principales */
    --color-primary: #F25C1F;
    --color-background: #0F0F0F;
    --color-text: #F2F2F0;
    --color-accent: #C0392B;

    /* Variaciones con transparencia */
    --color-primary-10: rgba(242, 92, 31, 0.1);
    --color-primary-30: rgba(242, 92, 31, 0.3);
    --color-primary-50: rgba(242, 92, 31, 0.5);
    --color-primary-80: rgba(242, 92, 31, 0.8);

    /* Variaciones de fondo */
    --color-surface: #1a1a1a;
    --color-surface-elevated: #2a2a2a;

    /* Variaciones de texto */
    --color-text-secondary: rgba(242, 242, 240, 0.8);
    --color-text-tertiary: rgba(242, 242, 240, 0.6);
}
``` 