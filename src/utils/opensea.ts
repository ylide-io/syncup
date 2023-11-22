import { ethers } from 'ethers'
import { Chain, OpenSeaSDK } from 'opensea-js'

const collectionSlug = 'syncdup'
const openseaApiKey = 'adc798f1e94a41e4900e36815295371b'
const tokenAddress = '0x965a10b66e4ae91f0d87dd5628e6276741c3e15f'
const tokenChain = Chain.Polygon

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

export async function getNftDetails(params: { auctionId: string }) {
	return await openseaSDK.api.getNFT(tokenChain, tokenAddress, params.auctionId)
}

export async function getAllNfts() {
	return await openseaSDK.api.getNFTsByCollection(collectionSlug)
}

export async function getBids(params: { auctionId: string }) {
	return await openseaSDK.api.getOrders({
		side: 'bid',
		assetContractAddress: tokenAddress,
		tokenId: params.auctionId,
		orderBy: 'eth_price',
		orderDirection: 'desc',
	})
}

export async function getUserBids(params: { address: string; auctionIds: string[] }) {
	return await openseaSDK.api.getOrders({
		side: 'bid',
		maker: params.address.toLowerCase(),
		assetContractAddress: tokenAddress,
		tokenIds: params.auctionIds,
	})
}

export async function createBid(params: { auctionId: string }) {
	return await openseaSDK.createOffer({
		asset: {
			tokenId: params.auctionId,
			tokenAddress,
		},
		accountAddress,
		startAmount: 0.001,
	})
}
