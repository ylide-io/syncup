import { ethers } from 'ethers'
import { Chain, OpenSeaSDK } from 'opensea-js'

async function makeOrder() {
	const collectionSlug = 'syncdup'
	const openseaApiKey = 'adc798f1e94a41e4900e36815295371b'
	const tokenChain = Chain.Polygon
	const tokenAddress = '0x965a10b66e4ae91f0d87dd5628e6276741c3e15f'
	const tokenId = '1'

	// OpenSea SDK accepts providers and signers from ethers v5
	// @ts-expect-error - window
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	const accountAddress = await signer.getAddress()
	// patch signer for opensea
	// @ts-expect-error - patch signer for opensea
	signer.address = accountAddress
	const openseaSDK = new OpenSeaSDK(
		provider,
		{
			chain: tokenChain,
			apiKey: openseaApiKey,
		},
		undefined,
		// @ts-expect-error - patched signer
		signer,
	)

	// bid by signing with user wallet
	// const order = await openseaSDK.createOffer({
	// 	asset: {
	// 		tokenId,
	// 		tokenAddress,
	// 	},
	// 	accountAddress,
	// 	startAmount: 0.001,
	// })

	// delete bid
	// openseaSDK.cancelOrder({ order, accountAddress });

	// get info on auction
	// await openseaSDK.api.getOrders({ side: 'bid', assetContractAddress: tokenAddress, tokenId })

	// get info on bids
	// const offers = await openseaSDK.api.getOrders({
	// 	side: 'bid',
	// 	assetContractAddress: tokenAddress,
	// 	tokenId,
	// })
}
