// File: ./components/custom-ui/styling/glowing.ts
import { APPS } from '#types/ENUMS.ts';

// Define the return type for themed apps
type GlowingThemeObject = {
  inputBox: string;
  textareaUIComponent?: string;
  textarea?: string;
  checkbox: string;
  checkboxParent?: string;
  checkboxSecondary?: string;
  checkboxOld?: string;
  dropdown: string;
  dropdownItem: string;
  icon?: string;
  jsx: string;
  badge: string;
};

// Function overloads for proper typing
function Glowing(app: null): string;
function Glowing(app: APPS): GlowingThemeObject;
function Glowing(app: APPS | null): string | GlowingThemeObject;
function Glowing(app: APPS | null = null): string | GlowingThemeObject {
  const portalDefault = () => {
    // Glowing
    return `
      hover:border-[var(--primary)]
      hover:shadow-[0_0_6px_0_rgba(var(--primary-shadow),0.33)]
      focus-within:border-[var(--primary)]
      focus-within:shadow-[0_0_6px_0_rgba(var(--primary-shadow),0.33)]
      focus-within:ring-0
      focus-within:ring-transparent
    `;
  };

  // hover:bg-[var(--highlight)] hover:text-[var(--primary)]
  const portal: GlowingThemeObject = {
    inputBox: `
      border border-gray-300 rounded-md
      focus-within:border-primary 
      focus-within:shadow-[0_0_8px_#6D28D94D] 
      focus-within:ring-0 
      focus-within:ring-transparent 
      placeholder:opacity-100 
      focus-within:placeholder:opacity-0 
      placeholder:transition-opacity 
      placeholder:duration-300`,

    textareaUIComponent: `
    flex w-full min-w-0  px-3 py-1 text-base 
    rounded-md border-transparent bg-transparent outline-none 
    placeholder:text-muted-foreground 
    selection:bg-primary selection:text-primary-foreground 
    transition-[color,box-shadow] 
    file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium 
    disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,

    textarea: `w-full min-h-[80px] resize-y px-3 py-1
      border-none bg-transparent outline-none rounded-md
      focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-transparent
      `,

    checkboxOld: `h-5 w-5 cursor-pointer
      focus-visible:border-primary 
      focus-visible:shadow-[0_0_8px_#6D28D94D] 
      focus-visible:ring-0 
      focus-visible:ring-transparent 
      focus:ring-0 
      focus:ring-transparent 
      hover:border-primary 
      hover:shadow-[0_0_8px_#6D28D94D] 
      hover:ring-0 
      hover:ring-transparent 
      focus:ring-0 
      focus:ring-transparent 
      placeholder:opacity-100 
      focus:placeholder:opacity-0 
      placeholder:transition-opacity 
      placeholder:duration-300
      [&:has([data-state=checked])]:!border-[var(--primary)] 
      [&:has([data-state=checked])]:shadow-[0_0_8px_0_rgba(var(--primary-shadow),0.33)] 
      [&:has([data-state=checked])]:bg-[var(--primary)] 
      [&:has([data-state=checked])]:text-[var(--primary)]               
    `,

    checkboxParent: `flex flex-row items-center justify-center w-full !p-0 !m-0`,
    checkboxSecondary: `group flex items-center justify-center cursor-pointer hover:bg-secondary p-1.5 rounded-sm`,
    checkbox: `border-[var(--table-border)] group-hover:border-primary cursor-pointer w-[20px] h-[20px]`,

    dropdown: `
      border border-gray-300 rounded-md
      hover:border-[var(--primary)] 
      hover:shadow-[0_0_8px_0_rgba(var(--primary-shadow),0.33)] 
      hover:bg-[var(--highlight)] 
      hover:text-[var(--primary)] 
      focus:border-[var(--primary)] 
      focus:shadow-[0_0_8px_0_rgba(var(--primary-shadow),0.33)] 
      focus-visible:border-[var(--primary)] 
      focus-visible:shadow-[0_0_8px_0_rgba(var(--primary-shadow),0.33)] 
      focus:ring-none 
      focus:ring-transparent 
      focus-visible:ring-none 
      focus-visible:ring-transparent
    `,

    dropdownItem: `
      focus:bg-[var(--highlight)] 
      focus:text-[var(--primary)]
      data-[highlighted=true]:bg-[var(--highlight)]
      data-[highlighted=true]:text-[var(--primary)]
      hover:bg-[var(--highlight)]
      hover:text-[var(--primary)]
    `,

    icon: `text-grey-700 hover:text-[var(--primary)] hover:bg-[var(--secondary)]`,

    jsx: `[cmdk-item][data-highlighted=true] { 
      background-color: var(--highlight) !important; 
      color: var(--primary) !important; 
    } 
    [cmdk-item]:hover { 
      background-color: var(--highlight) !important; 
      color: var(--primary) !important; 
    } 
    [cmdk-item][data-selected=true] { 
      background-color: var(--highlight) !important; 
      color: var(--primary) !important; 
    }`,
    badge: 'bg-primary rounded-sm text-white',
  };

  const policiesAndProcedures: GlowingThemeObject = {
    // --- THIS IS THE FIX ---
    // Replaced the broken rgba(var(--...)) with a direct hex color and opacity,
    // just like the working portal theme. #6DA017 is the green theme color,
    // and 4D is the hex for ~30% opacity.
    inputBox: `focus-within:border-[var(--policiesAndProcedures-primary)] 
      focus-within:shadow-[0_0_8px_#6DA0174D]
      focus-within:ring-0 
      focus-within:ring-transparent 
      placeholder:opacity-100 
      focus-within:placeholder:opacity-0 
      placeholder:transition-opacity 
      placeholder:duration-300`,
    // --- END FIX ---

    checkbox: `focus-visible:border-policiesAndProcedures-primary 
      focus-visible:shadow-[0_0_8px_#6D28D94D] 
      focus-visible:ring-0 
      focus-visible:ring-transparent 
      focus:ring-0 
      focus:ring-transparent 
      placeholder:opacity-100 
      focus:placeholder:opacity-0 
      placeholder:transition-opacity 
      placeholder:duration-300
      [&:has([data-state=checked])]:!border-[var(--policiesAndProcedures-primary)] 
      [&:has([data-state=checked])]:shadow-[0_0_8px_0_rgba(var(--policiesAndProcedures-primary-shadow),0.33)] 
      [&:has([data-state=checked])]:bg-[var(--policiesAndProcedures-highlight)] 
      [&:has([data-state=checked])]:text-[var(--policiesAndProcedures-primary)]               
    `,
    dropdown: `hover:border-[var(--policiesAndProcedures-primary)] 
      hover:shadow-[0_0_8px_0_rgba(var(--policiesAndProcedures-primary-shadow),0.33)] 
      hover:bg-[var(--policiesAndProcedures-highlight)] 
      hover:text-[var(--policiesAndProcedures-primary)] 
      focus:border-[var(--policiesAndProcedures-primary)] 
      focus:shadow-[0_0_8px_0_rgba(var(--policiesAndProcedures-primary-shadow),0.33)] 
      focus-visible:border-[var(--policiesAndProcedures-primary)] 
      focus-visible:shadow-[0_0_8px_0_rgba(var(--policiesAndProcedures-primary-shadow),0.33)] 
      focus:ring-none 
      focus:ring-transparent 
      focus-visible:ring-none 
      focus-visible:ring-transparent`,
    dropdownItem: `
      focus:bg-[var(--policiesAndProcedures-highlight)] 
      focus:text-[var(--policiesAndProcedures-primary)]
      data-[highlighted=true]:bg-[var(--policiesAndProcedures-highlight)]
      data-[highlighted=true]:text-[var(--policiesAndProcedures-primary)]
      hover:bg-[var(--policiesAndProcedures-highlight)]
      hover:text-[var(--policiesAndProcedures-primary)]
    `,
    jsx: `[cmdk-item][data-highlighted=true] { 
      background-color: var(--policiesAndProcedures-highlight) !important; 
      color: var(--policiesAndProcedures-primary) !important; 
    } 
    [cmdk-item]:hover { 
      background-color: var(--policiesAndProcedures-highlight) !important; 
      color: var(--policiesAndProcedures-primary) !important; 
    } 
    [cmdk-item][data-selected=true] { 
      background-color: var(--policiesAndProcedures-highlight) !important; 
      color: var(--policiesAndProcedures-primary) !important; 
    }`,
    badge: 'bg-policiesAndProcedures-primary rounded-sm text-white',
  };

  const forms: GlowingThemeObject = {
    inputBox: `focus-within:border-[var(--forms-primary)] 
      focus-within:shadow-[0_0_8px_#08a2734D]
      focus-within:ring-0 
      focus-within:ring-transparent 
      placeholder:opacity-100 
      focus-within:placeholder:opacity-0 
      placeholder:transition-opacity 
      placeholder:duration-300`,

    checkbox: `focus-visible:border-[var(--forms-primary)] 
      focus-visible:shadow-[0_0_8px_#08a2734D] 
      focus-visible:ring-0 
      focus-visible:ring-transparent 
      focus:ring-0 
      focus:ring-transparent 
      placeholder:opacity-100 
      focus:placeholder:opacity-0 
      placeholder:transition-opacity 
      placeholder:duration-300
      [&:has([data-state=checked])]:!border-[var(--forms-primary)] 
      [&:has([data-state=checked])]:shadow-[0_0_8px_#08a2734D] 
      [&:has([data-state=checked])]:bg-[var(--forms-primary)] 
      [&:has([data-state=checked])]:text-[var(--forms-primary)]               
    `,
    dropdown: `hover:border-[var(--forms-primary)] 
      hover:shadow-[0_0_8px_#08a2734D] 
      hover:bg-[var(--forms-highlight)] 
      hover:text-[var(--forms-primary)] 
      focus:border-[var(--forms-primary)] 
      focus:shadow-[0_0_8px_#08a2734D] 
      focus-visible:border-[var(--forms-primary)] 
      focus-visible:shadow-[0_0_8px_#08a2734D] 
      focus:ring-none 
      focus:ring-transparent 
      focus-visible:ring-none 
      focus-visible:ring-transparent`,
    dropdownItem: `
      focus:bg-[var(--forms-highlight)] 
      focus:text-[var(--forms-primary)]
      data-[highlighted=true]:bg-[var(--forms-highlight)]
      data-[highlighted=true]:text-[var(--forms-primary)]
      hover:bg-[var(--forms-highlight)]
      hover:text-[var(--forms-primary)]
    `,
    jsx: `[cmdk-item][data-highlighted=true] { 
      background-color: var(--forms-highlight) !important; 
      color: var(--forms-primary) !important; 
    } 
    [cmdk-item]:hover { 
      background-color: var(--forms-highlight) !important; 
      color: var(--forms-primary) !important; 
    } 
    [cmdk-item][data-selected=true] { 
      background-color: var(--forms-highlight) !important; 
      color: var(--forms-primary) !important; 
    }`,
    badge: 'bg-[var(--forms-primary)] rounded-sm text-white',
  };

  const inspections: GlowingThemeObject = {
    inputBox: `focus-within:border-[var(--inspections-primary)] 
      focus-within:shadow-[0_0_8px_#337CF34D]
      focus-within:ring-0 
      focus-within:ring-transparent 
      placeholder:opacity-100 
      focus-within:placeholder:opacity-0 
      placeholder:transition-opacity 
      placeholder:duration-300`,

    checkbox: `focus-visible:border-[var(--inspections-primary)] 
      focus-visible:shadow-[0_0_8px_#337CF34D] 
      focus-visible:ring-0 
      focus-visible:ring-transparent 
      focus:ring-0 
      focus:ring-transparent 
      placeholder:opacity-100 
      focus:placeholder:opacity-0 
      placeholder:transition-opacity 
      placeholder:duration-300
      [&:has([data-state=checked])]:!border-[var(--inspections-primary)] 
      [&:has([data-state=checked])]:shadow-[0_0_8px_#337CF34D] 
      [&:has([data-state=checked])]:bg-[var(--inspections-primary)] 
      [&:has([data-state=checked])]:text-[var(--inspections-primary)]               
    `,
    dropdown: `hover:border-[var(--inspections-primary)] 
      hover:shadow-[0_0_8px_#337CF34D] 
      hover:bg-[var(--inspections-highlight)] 
      hover:text-[var(--inspections-primary)] 
      focus:border-[var(--inspections-primary)] 
      focus:shadow-[0_0_8px_#337CF34D] 
      focus-visible:border-[var(--inspections-primary)] 
      focus-visible:shadow-[0_0_8px_#337CF34D] 
      focus:ring-none 
      focus:ring-transparent 
      focus-visible:ring-none 
      focus-visible:ring-transparent`,
    dropdownItem: `
      focus:bg-[var(--inspections-highlight)] 
      focus:text-[var(--inspections-primary)]
      data-[highlighted=true]:bg-[var(--inspections-highlight)]
      data-[highlighted=true]:text-[var(--inspections-primary)]
      hover:bg-[var(--inspections-highlight)]
      hover:text-[var(--inspections-primary)]
    `,
    jsx: `[cmdk-item][data-highlighted=true] { 
      background-color: var(--inspections-highlight) !important; 
      color: var(--inspections-primary) !important; 
    } 
    [cmdk-item]:hover { 
      background-color: var(--inspections-highlight) !important; 
      color: var(--inspections-primary) !important; 
    } 
    [cmdk-item][data-selected=true] { 
      background-color: var(--inspections-highlight) !important; 
      color: var(--inspections-primary) !important; 
    }`,
    badge: 'bg-[var(--inspections-primary)] rounded-sm text-white',
  };

  if (app === null) {
    return portalDefault();
  } // for backwards compatibility

  switch (app) {
    case APPS.PORTAL:
      return portal;
    case APPS.POLICIES_AND_PROCEDURES:
      return policiesAndProcedures;
    case APPS.FORMS:
      return forms;
    case APPS.INSPECTIONS:
      return inspections;
    default:
      return portalDefault();
  }
}

// Create GlowingInstance and attach portal directly
const GlowingInstance = Glowing;
export default GlowingInstance;
export { Glowing };
