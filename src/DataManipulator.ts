import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;

    const historicalAverageRatio = 1.1; // Example value, replace with actual 12-month historical average
    const standardDeviation = 0.05; // Example value, replace with actual standard deviation

    const upperBound = historicalAverageRatio + 2 * standardDeviation;
    const lowerBound = historicalAverageRatio - 2 * standardDeviation;

    const latestTimestamp = new Date(Math.max(
      new Date(serverRespond[0].timestamp).getTime(),
      new Date(serverRespond[1].timestamp).getTime()
    ));

    const triggerAlert = (ratio > upperBound || ratio < lowerBound) ? ratio : undefined;

    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: latestTimestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: triggerAlert,
    };
  }
}
