// File: ./components/custom-ui/styling/Themes.ts
import { APPS } from '@/types/ENUMS';

const Themes = (app: APPS) => {
  const portal = () => {
    const contentSection = {
      padding: `w-full py-4 px-6`,
      mobilePadding: `pb-16 pt-4 px-4`,
    };

    const textColor = {
      default: `text-gray-600`,
      primary: `text-primary`,
      secondary: `text-secondary`,
      highlight: `text-highlight`,
    };

    const button = {
      default: `group border border-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)]`,
      destructive: `group border border-destructive bg-destructive text-white hover:bg-destructive/90`,
      outline: `group border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] active:bg-[var(--third)] active:text-[var(--primary)]`,
      secondary: `group bg-secondary text-secondary-foreground hover:bg-secondary/80`,
      ghost: ` group hover:bg-[var(--secondary)] hover:text-[var(--primary)] active:bg-[var(--third)] active:text-[var(--primary)]`,
      link: `group text-primary underline-offset-4 hover:underline`,
    };

    const combobox = {
      trigger: `text-gray-700 hover:bg-[var(--highlight)] hover:text-[var(--primary)]`,
      triggerText: `font-normal text-gray-700 hover:text-[var(--primary)]`,
    };

    const dropdownMenu = {
      content: `!m-0 !p-0 rounded-sm`,
      item: `!m-0 h-[37px] px-[16px] py-[8px] gap-[8px] rounded-none flex flex-row items-center cursor-pointer overflow-hidden focus:bg-[var(--highlight)] focus:text-[var(--primary)] data-[highlighted=true]:bg-[var(--highlight)] data-[highlighted=true]:text-[var(--primary)] hover:bg-[var(--highlight)] hover:text-[var(--primary)]`,
      itemSelected: `bg-[var(--highlight)] text-[var(--primary)]`,
    };

    return {
      contentSection,
      button,
      combobox,
      dropdownMenu,
      textColor,
    };
  };

  const policiesAndProcedures = () => {
    const contentSection = {
      padding: `w-full py-4 px-6`,
      mobilePadding: `pb-16 pt-4 px-4`,
    };
    const textColor = {
      default: `text-gray-600`,
      primary: `text-primary`,
      secondary: `text-secondary`,
      highlight: `text-highlight`,
    };

    const button = {
      default: ` border border-[var(--policiesAndProcedures-primary)] bg-[var(--policiesAndProcedures-primary)] text-white hover:bg-[var(--policiesAndProcedures-accent)] active:bg-[var(--policiesAndProcedures-active)]`,
      destructive: `border border-destructive bg-destructive text-white hover:bg-destructive/90`,
      outline: ` border border-[var(--policiesAndProcedures-primary)] text-[var(--policiesAndProcedures-primary)] hover:bg-[var(--policiesAndProcedures-highlight)] hover:text-[var(--policiesAndProcedures-primary)] active:bg-[var(--policiesAndProcedures-third)] active:text-[var(--policiesAndProcedures-primary)]`,
      secondary: `bg-[var(--policiesAndProcedures-highlight)] text-[var(--policiesAndProcedures-primary)] hover:bg-[var(--policiesAndProcedures-highlight)]/80`,
      ghost: ` hover:bg-[var(--policiesAndProcedures-highlight)] hover:text-[var(--policiesAndProcedures-primary)] active:bg-[var(--policiesAndProcedures-third)] active:text-[var(--policiesAndProcedures-primary)]`,
      link: `text-[var(--policiesAndProcedures-primary)] underline-offset-4 hover:underline`,
    };

    const combobox = {
      trigger: `text-[#374151] hover:bg-[var(--policiesAndProcedures-highlight)] hover:text-[var(--policiesAndProcedures-primary)]`,
      triggerText: `font-normal text-gray-700 hover:text-[var(--policiesAndProcedures-primary)]`,
    };

    const dropdownMenu = {
      content: `w-[187px] p-0 rounded-sm`,
      item: `h-[37px] px-[16px] py-[8px] gap-[8px] rounded-none flex flex-row items-center gap-2 cursor-pointer focus:bg-[var(--policiesAndProcedures-highlight)] focus:text-[var(--policiesAndProcedures-primary)] data-[highlighted=true]:bg-[var(--policiesAndProcedures-highlight)] data-[highlighted=true]:text-[var(--policiesAndProcedures-primary)] hover:bg-[var(--policiesAndProcedures-highlight)] hover:text-[var(--policiesAndProcedures-primary)]`,
      itemSelected: `bg-[var(--policiesAndProcedures-highlight)] text-[var(--policiesAndProcedures-primary)]`,
    };

    return {
      contentSection,
      button,
      combobox,
      dropdownMenu,
      textColor,
    };
  };

  // --- NEW THEME ADDED ---
  const forms = () => {
    const contentSection = {
      padding: `w-full py-4 px-6`,
      mobilePadding: `pb-16 pt-4 px-4`,
    };
    const textColor = {
      default: `text-gray-600`,
      primary: `text-primary`,
      secondary: `text-secondary`,
      highlight: `text-highlight`,
    };

    const button = {
      default: ` border border-[var(--forms-primary)] bg-[var(--forms-primary)] text-white hover:bg-[var(--forms-primary-hover)] active:bg-[var(--forms-primary)]`,
      destructive: `border border-destructive bg-destructive text-white hover:bg-destructive/90`,
      outline: ` border border-[var(--forms-primary)] text-[var(--forms-primary)] hover:bg-[var(--forms-highlight)] hover:text-[var(--forms-primary)] active:bg-[var(--forms-highlight)] active:text-[var(--forms-primary)]`,
      secondary: `bg-[var(--forms-highlight)] text-[var(--forms-primary)] hover:bg-[var(--forms-highlight)]/80`,
      ghost: ` hover:bg-[var(--forms-highlight)] hover:text-[var(--forms-primary)] active:bg-[var(--forms-highlight)] active:text-[var(--forms-primary)]`,
      link: `text-[var(--forms-primary)] underline-offset-4 hover:underline`,
    };

    const combobox = {
      trigger: `text-[#374151] hover:bg-[var(--forms-highlight)] hover:text-[var(--forms-primary)]`,
      triggerText: `font-normal text-gray-700 hover:text-[var(--forms-primary)]`,
    };

    const dropdownMenu = {
      content: `w-[187px] p-0 rounded-sm`,
      item: `h-[37px] px-[16px] py-[8px] gap-[8px] rounded-none flex flex-row items-center gap-2 cursor-pointer focus:bg-[var(--forms-highlight)] focus:text-[var(--forms-primary)] data-[highlighted=true]:bg-[var(--forms-highlight)] data-[highlighted=true]:text-[var(--forms-primary)] hover:bg-[var(--forms-highlight)] hover:text-[var(--forms-primary)]`,
      itemSelected: `bg-[var(--forms-highlight)] text-[var(--forms-primary)]`,
    };

    return {
      contentSection,
      button,
      combobox,
      dropdownMenu,
      textColor,
    };
  };
  // --- END NEW THEME ---

  const inspections = () => {
    const contentSection = {
      padding: `w-full py-4 px-6`,
      mobilePadding: `pb-16 pt-4 px-4`,
    };
    const textColor = {
      default: `text-gray-600`,
      primary: `text-primary`,
      secondary: `text-secondary`,
      highlight: `text-highlight`,
    };

    const button = {
      default: ` border border-[var(--inspections-primary)] bg-[var(--inspections-primary)] text-white hover:bg-[var(--inspections-primary-hover)] active:bg-[var(--inspections-primary)]`,
      destructive: `border border-destructive bg-destructive text-white hover:bg-destructive/90`,
      outline: ` border border-[var(--inspections-primary)] text-[var(--inspections-primary)] hover:bg-[var(--inspections-highlight)] hover:text-[var(--inspections-primary)] active:bg-[var(--inspections-highlight)] active:text-[var(--inspections-primary)]`,
      secondary: `bg-[var(--inspections-highlight)] text-[var(--inspections-primary)] hover:bg-[var(--inspections-highlight)]/80`,
      ghost: ` hover:bg-[var(--inspections-highlight)] hover:text-[var(--inspections-primary)] active:bg-[var(--inspections-highlight)] active:text-[var(--inspections-primary)]`,
      link: `text-[var(--inspections-primary)] underline-offset-4 hover:underline`,
    };

    const combobox = {
      trigger: `text-[#374151] hover:bg-[var(--inspections-highlight)] hover:text-[var(--inspections-primary)]`,
      triggerText: `font-normal text-gray-700 hover:text-[var(--inspections-primary)]`,
    };

    const dropdownMenu = {
      content: `w-[187px] p-0 rounded-sm`,
      item: `h-[37px] px-[16px] py-[8px] gap-[8px] rounded-none flex flex-row items-center gap-2 cursor-pointer focus:bg-[var(--inspections-highlight)] focus:text-[var(--inspections-primary)] data-[highlighted=true]:bg-[var(--inspections-highlight)] data-[highlighted=true]:text-[var(--inspections-primary)] hover:bg-[var(--inspections-highlight)] hover:text-[var(--inspections-primary)]`,
      itemSelected: `bg-[var(--inspections-highlight)] text-[var(--inspections-primary)]`,
    };

    return {
      contentSection,
      button,
      combobox,
      dropdownMenu,
      textColor,
    };
  };

  switch (app) {
    case APPS.PORTAL:
      return portal();
    case APPS.POLICIES_AND_PROCEDURES:
      return policiesAndProcedures();
    // --- NEW CASE ADDED ---
    case APPS.FORMS:
      return forms();
    // --- END NEW CASE ---
    case APPS.TRAINING:
      return portal();
    case APPS.INSPECTIONS:
      return inspections();
    case APPS.CONTRACTORS:
      return portal();
    case APPS.HAZARDS:
      return portal();
    default:
      return portal();
  }
};

const ThemesInstance = Themes;
export default ThemesInstance;
