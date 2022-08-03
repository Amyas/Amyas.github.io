import { ref } from "@vue/reactivity";
import { isFunction } from "@vue/shared";
import { h } from "./h";

export function defineAsyncComponent(loaderOptions) {
  if (isFunction(loaderOptions)) {
    loaderOptions = {
      loader: loaderOptions,
    };
  }

  let Component = null;
  return {
    setup() {
      const {
        loader,
        timeout,
        errorComponent,
        loadingComponent,
        delay,
        onError,
      } = loaderOptions;

      const loaded = ref(false);
      const error = ref(false);
      const loading = ref(false);

      if (timeout) {
        setTimeout(() => {
          error.value = true;
        }, timeout);
      }

      let timer;
      if (delay) {
        timer = setTimeout(() => {
          loading.value = true;
        }, delay);
      } else {
        loading.value = true;
      }

      function load() {
        return loader().catch((err) => {
          if (onError) {
            return new Promise((resolve, reject) => {
              const retry = () => resolve(load());
              const fail = () => reject();
              onError(retry, fail);
            });
          } else {
            throw err;
          }
        });
      }

      load()
        .then((value) => {
          loaded.value = true;
          Component = value;
        })
        .catch((err) => {
          error.value = true;
        })
        .finally(() => {
          clearTimeout(timer);
          loading.value = false;
        });

      return () => {
        if (loaded.value) {
          return h(Component, {}, {});
        } else if (error.value && errorComponent) {
          return h(errorComponent, {}, {});
        } else if (loading.value && loadingComponent) {
          return h(loadingComponent, {}, {});
        } else {
          return h("span", {}, {});
        }
      };
    },
  };
}
