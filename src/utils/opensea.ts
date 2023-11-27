import { ethers } from 'ethers'
import { Chain, OpenSeaSDK } from 'opensea-js'
import { OrderV2 } from 'opensea-js/lib/orders/types'

import { formatAddress } from './string.ts'

const collectionSlug = 'syncdup'
const openseaApiKey = 'adc798f1e94a41e4900e36815295371b'
const tokenAddress = '0x965a10b66e4ae91f0d87dd5628e6276741c3e15f'
const tokenChain = Chain.Polygon

async function getOpenSeaSDK<T>(callback: (openseaSDK: OpenSeaSDK, accountAddress: string) => T) {
	// OpenSea SDK accepts providers and signers from ethers v5
	// @ts-expect-error - window
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	// https://stackoverflow.com/q/71198438/4899346
	await provider.send('eth_requestAccounts', [])
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

	return callback(openseaSDK, accountAddress)
}

//

export async function getNftDetails(params: { nftId: string }) {
	return await getOpenSeaSDK(openseaSDK => openseaSDK.api.getNFT(tokenChain, tokenAddress, params.nftId))
}

export async function getAllNfts() {
	return await getOpenSeaSDK(openseaSDK => openseaSDK.api.getNFTsByCollection(collectionSlug))
}

export async function getAsks(params: { nftIds: string[] }) {
	return await getOpenSeaSDK(openseaSDK =>
		openseaSDK.api.getOrders({
			side: 'ask',
			assetContractAddress: tokenAddress,
			tokenIds: params.nftIds,
			orderBy: 'created_date',
			orderDirection: 'desc',
		}),
	)
}

export async function getLatestAsk(params: { nftId: string }) {
	return await getOpenSeaSDK(
		async openseaSDK =>
			(
				await openseaSDK.api.getOrders({
					side: 'ask',
					assetContractAddress: tokenAddress,
					tokenId: params.nftId,
					orderBy: 'created_date',
					orderDirection: 'desc',
				})
			).orders[0],
	)
}

export async function getBids(params: { nftId: string }) {
	return await getOpenSeaSDK(openseaSDK =>
		openseaSDK.api.getOrders({
			side: 'bid',
			assetContractAddress: tokenAddress,
			tokenId: params.nftId,
			orderBy: 'eth_price',
			orderDirection: 'desc',
		}),
	)
}

export async function getUserBids(params: { address: string; nftIds: string[] }) {
	return await getOpenSeaSDK(openseaSDK =>
		openseaSDK.api.getOrders({
			side: 'bid',
			maker: formatAddress(params.address),
			assetContractAddress: tokenAddress,
			tokenIds: params.nftIds,
		}),
	)
}

export async function createBid(params: { nftId: string }) {
	return await getOpenSeaSDK((openseaSDK, accountAddress) =>
		openseaSDK.createOffer({
			asset: {
				tokenId: params.nftId,
				tokenAddress,
			},
			accountAddress,
			startAmount: 0.001,
		}),
	)
}

export async function cancelBid(params: { bid: OrderV2 }) {
	return await getOpenSeaSDK((openseaSDK, accountAddress) =>
		openseaSDK.cancelOrder({
			order: params.bid,
			accountAddress,
		}),
	)
}
