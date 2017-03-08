const path = require('path');
const { exec } = require('child_process');

function modulesDependencies(modules) {
  let dependencies = [];
  modules.forEach(module => {
    dependencies.push(module);

    const modulePath = path.join(__dirname, '../app/node_modules/' + module);
    const modulePackage = require(path.join(modulePath, 'package.json'));
    let moduleDeps = [];

    for (var depModule in modulePackage.dependencies) {
      moduleDeps.push(depModule);
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
