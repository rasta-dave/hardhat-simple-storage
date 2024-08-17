// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    // * hardhat gets contract from artifacts folder that is the reason it knows contract with name and we can get this way.
    const SimpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    console.log("Waiting for contract to deployed...")

    console.log("Contract address")
    console.log(simpleStorage.target)

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        // 6 blocks is sort of a guess
        await simpleStorage.deploymentTransaction().wait(6)
        await verify(simpleStorage.target, [])
    }
    console.log("Simple Storage deployed to:", simpleStorage.target)

    // Get the current value
    let currentValue = await simpleStorage.retrieve()
    console.log(`Current value: ${currentValue}`)

    // Update the value
    console.log("Updating contract...")
    let transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait() // returns transaction receipt
    currentValue = await simpleStorage.retrieve()
    console.log(`Current value: ${currentValue}`)
}

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
