const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

// describe("SimpleStorage", () => {})
describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage

    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        // assert
        // expect
        assert.equal(currentValue.toString(), expectedValue)
        // expect(currentValue.toString()).to.equal(expectedValue)
    })

    it("Should update when we call store.", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)

        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should add a person to the listOfPeople", async function () {
        const name = "John"
        const favoriteNumber = "7"

        // Call the addPerson function
        await simpleStorage.addPerson(name, favoriteNumber)

        // Retrieve the first person from the listOfPeople[] array
        const person = await simpleStorage.listOfPeople(0)

        // Verify that the person was added correctly
        expect(person[0]).to.equal(favoriteNumber)
        expect(person[1]).to.equal(name)
    })

    it("Should update nameToFavoriteNumber mapping correctly", async function () {
        const name = "Bob"
        const favoriteNumber = "7"

        // Call the addPerson function
        await simpleStorage.addPerson(name, favoriteNumber)

        // Verify that the mapping was updated correctly
        const mappedNumber = await simpleStorage.nameToFavoriteNumber(name)
        expect(mappedNumber).to.equal(favoriteNumber)
    })
})
