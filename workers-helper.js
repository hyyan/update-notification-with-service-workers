class WrokersHelper {

  constructor(file, onUpdate) {

    if (!file) throw new Error('Service worker file is missing');

    this.file = file;
  }

  register(onUpdate) {

    if (typeof onUpdate !== 'function')
      throw new Error('onUpdate function is missing');

    return navigator.serviceWorker
      .register(this.file)
      .then((registeration) => {

        console.log(
          `Service worker (${this.file}) is registered successfully`
        );

        this._monitorUpdates(registeration, onUpdate);
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

      }, () => {
        console.warn(
          `Unable to register the service worker (${this.file})`
        )
      })
  }

  _monitorUpdates(registeration, onUpdate) {

    // page was not installed using a service worker
    if (!navigator.serviceWorker.controller) return;

    // update is ready and waitting
    if (registeration.waiting) onUpdate(registeration.waiting);

    let isInstalled = (worker) => {
      this._getWrokerState(worker)
        .then((state) => {
          if ('installed' === state) onUpdate(worker);
        });
    }

    // service worker is not installed yet wait unti its state is resolved
    if (registeration.installing) {
      isInstalled(registeration.installing);
      return;
    }

    // update was found event
    registeration.addEventListener('updatefound', () => {
      isInstalled(registeration.installing);
    })
  }

  _getWrokerState(worker) {
    return new Promise((resolve) => {
      worker.addEventListener('statechange', () => {
        resolve(worker.state);
      })
    });
  }
}
