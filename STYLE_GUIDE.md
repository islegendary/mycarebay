# MyCareBay Style Guide

## Overview
This document outlines the centralized styling system for MyCareBay, ensuring consistent design across all components.

## Design Tokens

### Colors
All colors are defined as CSS custom properties in `index.css`:

```css
:root {
  /* Brand Colors */
  --brand-blue-light: #E0F2FE;
  --brand-blue: #0EA5E9;
  --brand-blue-dark: #0369A1;
  
  /* Gray Scale */
  --brand-gray-light: #F8FAFC;
  --brand-gray-medium: #475569;
  --brand-gray: #334155;
  --brand-gray-dark: #1E293B;
  
  /* Semantic Colors */
  --text-primary: var(--brand-gray-dark);
  --text-secondary: var(--brand-gray-medium);
  --text-muted: var(--brand-gray);
  --text-inverse: #FFFFFF;
}
```

### Typography

#### Headings
- **Heading 1**: `.text-heading-1` - 3rem, 800 weight
- **Heading 2**: `.text-heading-2` - 2.25rem, 700 weight
- **Heading 3**: `.text-heading-3` - 1.875rem, 600 weight
- **Heading 4**: `.text-heading-4` - 1.5rem, 600 weight

#### Body Text
- **Large**: `.text-body-large` - 1.125rem, 400 weight
- **Regular**: `.text-body` - 1rem, 400 weight
- **Small**: `.text-body-small` - 0.875rem, 400 weight
- **Caption**: `.text-caption` - 0.75rem, 500 weight

### Buttons

#### Primary Button
```html
<button class="btn btn-primary">Primary Action</button>
```

#### Secondary Button
```html
<button class="btn btn-secondary">Secondary Action</button>
```

#### Button Sizes
- **Small**: `.btn-sm`
- **Regular**: (default)
- **Large**: `.btn-lg`
- **Extra Large**: `.btn-xl`

### Cards

#### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here</p>
  </div>
</div>
```

### Forms

#### Form Group
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input class="form-input" type="text" placeholder="Enter text">
</div>
```

#### Textarea
```html
<textarea class="form-input form-textarea" placeholder="Enter text"></textarea>
```

### Navigation

#### Nav Item
```html
<a class="nav-item" href="#">Navigation Link</a>
<a class="nav-item active" href="#">Active Link</a>
<a class="nav-item" href="#" disabled>Disabled Link</a>
```

### Badges

#### Plan Badges
```html
<span class="badge badge-free">Free</span>
<span class="badge badge-plus">Plus</span>
<span class="badge badge-pro">Pro</span>
```

## Usage Guidelines

### Text Colors
- **Primary text**: Use `var(--text-primary)` for headings and important content
- **Secondary text**: Use `var(--text-secondary)` for body text and descriptions
- **Muted text**: Use `var(--text-muted)` for captions and less important info

### Button Usage
- **Primary buttons**: Use for main actions (Submit, Save, Continue)
- **Secondary buttons**: Use for alternative actions (Cancel, Back, Edit)

### Spacing
Use the spacing variables for consistent spacing:
- `var(--spacing-xs)`: 0.25rem
- `var(--spacing-sm)`: 0.5rem
- `var(--spacing-md)`: 1rem
- `var(--spacing-lg)`: 1.5rem
- `var(--spacing-xl)`: 2rem
- `var(--spacing-2xl)`: 3rem

### Shadows
- `var(--shadow-sm)`: Subtle elevation
- `var(--shadow-md)`: Medium elevation
- `var(--shadow-lg)`: High elevation

## Accessibility

### Color Contrast
All text colors meet WCAG AA standards:
- Primary text: 4.5:1 contrast ratio
- Secondary text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

### Focus States
All interactive elements have visible focus states using `var(--brand-blue)`.

### Reduced Motion
Animations respect `prefers-reduced-motion` media query.

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adjustments
- Headings scale down on mobile
- Button padding adjusts for touch targets
- Spacing reduces for smaller screens

## Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Use semantic class names** for better maintainability
3. **Test with different screen sizes** and accessibility tools
4. **Keep components consistent** with the established patterns
5. **Use the centralized CSS file** for all styling decisions

## File Structure

```
mycarebay/
├── index.css          # Centralized styling system
├── STYLE_GUIDE.md     # This document
├── components/        # React components
└── index.html         # Tailwind config (references CSS vars)
```

## Maintenance

When updating styles:
1. Modify the CSS custom properties in `index.css`
2. Update this style guide if adding new patterns
3. Test across all components for consistency
4. Ensure accessibility standards are maintained
