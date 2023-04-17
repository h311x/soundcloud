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
      class="flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
      {...restProps}
    />
  )
}

Input.displayName = 'Input'

export default Input
