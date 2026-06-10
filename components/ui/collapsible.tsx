'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

import CollapsibleCSS from '@/assets/collapsible.module.css';

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      data-state={props.open ? 'open' : 'close'}
      {...props}
      className={`group ${props.className}`}
    />
  );
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
      className={`${CollapsibleCSS.animatedContent} ${props.className}`}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
