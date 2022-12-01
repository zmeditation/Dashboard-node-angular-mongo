
export type YandexParams = {
  token: string
}

export type PlacementsOptionYandex = {
  method: string,
  hostname: string,
  path: string
}

export type PreparePlacementsParams = {
  placements: any, 
  usdExchangeRate: number
}

export type RequestExchangeDate = {
	year: number,
	month: string | number,
	day: string | number
}

export type GetPlacementsResponse = {
	data: {
		currencies: object[],
		dimensions: { block_caption: any, block_type: any, date: any, domain: any },
		is_last_page: true,
		measures: { clicks_direct: any, partner_wo_nds: any, hits: any, shows: any },
		periods: [][],
		points: Points[],
		report_title: string,
		total_rows: number,
		totals: any
	},
	result: string
}

export type Points = {
	dimensions: Dimensions,
	measures: Measures
}

export type Dimensions = {
	block_caption: string,
	block_type: string,
	date: string[],
	domain: string
}

export type Measures = {
	hits: number,
  shows: number
	clicks_direct: number,
	partner_wo_nds: number,
}