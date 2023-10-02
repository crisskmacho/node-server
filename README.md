¿Qué sucedió al usar async y await?

-Async/await se utilizó para hacer que las funciones asincrónicas sean más legibles y fáciles de manejar. Cuando se declara una función como async, esto significa que puede contener operaciones asincrónicas y se pueden usar await dentro de ella para pausar la ejecución hasta que se resuelva una promesa.
-Al usar await, la ejecución del programa se detiene en ese punto hasta que la promesa se resuelva. Esto significa que el código que sigue a await no se ejecutará hasta que la promesa se  complete.
-Esto hace que el código sea más secuencial y más parecido a la programación síncrona, lo que puede mejorar la legibilidad y la mantenibilidad del código en comparación con el uso de .then() encadenados.

¿Qué sucedió al usar el método then()?

-El método .then() se utiliza para manejar promesas de manera asíncrona. Cuando se encadenan múltiples .then(), se crea una cadena de promesas que se resuelven de manera secuencial.
-Cada .then() permite especificar una función de callback que se ejecutará cuando la promesa anterior se resuelva. Esto permite manejar las promesas de manera más controlada y permite realizar  acciones específicas después de que una promesa se complete.
-Aunque el método .then() es útil para manejar promesas, puede resultar en un código que es más difícil de leer y de entender cuando se encadenan muchas promesas, especialmente en casos complejos. Esto se conoce como "Callback Hell" o "Pyramid of Doom".

¿Qué diferencias encontraste entre async, await y el método then()?

Async/await:
    Facilita la lectura del código asincrónico, haciéndolo más parecido a la programación síncrona.
    Permite que el código se escriba de manera más secuencial, lo que puede hacerlo más claro y mantenible.
    Se utiliza en funciones marcadas como async.
    Puede esperar una promesa usando await, lo que detiene la ejecución hasta que la promesa se resuelva.

Método .then():
    Se utiliza para manejar promesas y especificar acciones que se ejecutarán cuando una promesa se resuelva o sea rechazada.
    Se encadena a promesas, lo que permite controlar la secuencia de acciones después de que se resuelvan las promesas anteriores.
    Puede conducir a un código con una estructura más anidada y menos legible cuando se encadenan muchas promesas.