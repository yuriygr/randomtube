/**
 * Я очень ленивый, по этому некоторые компоненты мы будем подгружать так, кек
 * 
 * @author Боженька <god@heaven>
 * @version 1.0.1
 */
export default new class {
  install(app) {
    const components = require.context(
      // The relative path of the components folder
      '@/components/_global',
      // Whether or not to look in subfolders
      true,
      // The regular expression used to match base component filenames
      /[A-Z]\w+\.(vue|js)$/
    )
    
    components.keys().forEach(fileName => {
      // Get component config
      const componentConfig = components(fileName)
    
      // Register component globally
      app.component(
        componentConfig.default.name,
        // Look for the component options on `.default`, which will
        // exist if the component was exported with `export default`,
        // otherwise fall back to module's root.
        componentConfig.default || componentConfig
      )
    })
  }
}