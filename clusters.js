const cluster = require("cluster")
const os = require("os")

if(cluster.isMaster) {
  console.log(`Forking ${os.cpus().length} servers`)
  const cpus = os.cpus().length

  for (let index = 0; index < cpus; index++) {
    cluster.fork()
  }
} else {
  require('./server')
}
