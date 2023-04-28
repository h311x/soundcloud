import { VariantProps, cva } from 'class-variance-authority'
import { FunctionalComponent, HTMLAttributes } from 'vue'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'text-destructive border-destructive/50 dark:border-destructive [&>svg]:text-destructive text-destructive'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const Alert: FunctionalComponent<HTMLAttributes & VariantProps<typeof alertVariants>> = (
  { variant, ...props },
  { slots }
) => (
  <div class={alertVariants({ variant })} role="alert" {...props}>
    {slots.default?.()}
  </div>
)

Alert.displayName = 'Alert'

const AlertTitle: FunctionalComponent<HTMLAttributes> = (props, { slots }) => (
  <h5 class="mb-1 font-medium leading-none tracking-tight" {...props}>
    {slots.default?.()}
  </h5>
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription: FunctionalComponent<HTMLAttributes> = (props, { slots }) => (
  <div class="text-sm [&_p]:leading-relaxed" {...props}>
    {slots.default?.()}
  </div>
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
