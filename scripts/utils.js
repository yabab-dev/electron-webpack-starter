const path = require('path');
const { exec } = require('child_process');

// Exlcude packages (node & electron builtins)
const excludeModules = require('builtin-modules');
excludeModules.push('electron', 'original-fs');

function modulesDependencies(modules) {
  let dependencies = [];
  modules.forEach(module => {
    if (excludeModules.indexOf(module) >= 0) return;
    dependencies.push(module);

    const modulePath = path.join(__dirname, '../app/node_modules/' + module);
    const modulePackage = require(path.join(modulePath, 'package.json'));
    let moduleDeps = [];

    for (var depModule in modulePackage.dependencies) {
      if (excludeModules.indexOf(depModule) < 0) {
        moduleDeps.push(depModule);
      }
    }

    const subModules = modulesDependencies(moduleDeps);
    subModules.forEach(sub => {
      if (dependencies.indexOf(sub) < 0) dependencies.push(sub);
    });
  });
  return dependencies;
}

module.exports = {
  modulesDependencies: modulesDependencies,
};
