import { ref, watch, type Ref } from "vue";
import { onUnmounted } from "vue";

export function useDebounce<T>(value: Ref<T>, delay = 500) {
  const debouncedValue = ref<T>(value.value) as Ref<T>;
  let timeout: NodeJS.Timeout;

  watch(
    value,
    (newValue) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        debouncedValue.value = newValue;
      }, delay);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    clearTimeout(timeout);
  });

  return debouncedValue;
}
