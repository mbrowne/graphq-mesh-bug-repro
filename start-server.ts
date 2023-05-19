import { join } from 'path'
import { loadPackageDefinition, Server, ServerCredentials, ServiceClientConstructor, GrpcObject } from '@grpc/grpc-js'
import { load } from '@grpc/proto-loader'

const wrapServerWithReflection = require('grpc-node-server-reflection').default

export default async function startServer() {
    const server: Server = wrapServerWithReflection(new Server())

    let packageDefinition = await load('./helloworld.proto', {
        includeDirs: [join(__dirname, './proto')],
    })
    let grpcObject = loadPackageDefinition(packageDefinition)
    server.addService(((grpcObject as any).helloworld.GreetingService as ServiceClientConstructor).service, {
        getGreeting(call, callback) {
            callback(null, { greeting: 'Hello ' + call.request.name })
        },
    })

    packageDefinition = await load('./Playground/playground.proto', {
        includeDirs: [join(__dirname, './proto')],
    })
    grpcObject = loadPackageDefinition(packageDefinition)
    server.addService(
        ((grpcObject as any).artnet.coredata.playground.Playground as ServiceClientConstructor).service,
        {}
    )

    return new Promise<Server>((resolve, reject) => {
        server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), (error, port) => {
            if (error) {
                reject(error)
                return
            }
            server.start()

            console.log('gRPC Server started, listening: 0.0.0.0:' + port)
            resolve(server)
        })
    })
}
