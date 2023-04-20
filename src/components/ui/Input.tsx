import { FunctionalComponent, InputHTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'

const Input: FunctionalComponent<
  InputHTMLAttributes & { modelValue: string },
  { 'onUpdate:modelValue': (v: string) => void }
> = (props, { emit }) => {
  const data = useVModel(props, 'modelValue', emit)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { modelValue, ...restProps } = props
  return (
    <input
      v-model={data.value}
      type="text"
      class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...restProps}
    />
  )
}

Input.displayName = 'Input'

export default Input
