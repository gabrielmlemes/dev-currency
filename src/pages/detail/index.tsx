import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CoinProps } from "../home";
import styles from "./detail.module.css";

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

const Detail = () => {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navigate("/");
              return;
            }
            // Formatação de moeda para USD
            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            // Formatação e compatação de números
            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            // Formatação dos dados de cada moeda
            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(
                Number(data.data.marketCapUsd)
              ),
              formatedVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr)
              ),
            };

            setCoin(resultData);
            setLoading(false);
          });
      } catch (err) {
        navigate("/");
      }
    }

    getCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cripto]);

  if (loading || !coin) {
    return (
      <div className={styles.container}>
        <h1 className={styles.center}>Carregando detalhes...</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h2 className={styles.center}>{coin?.symbol}</h2>

      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLocaleLowerCase()}@2x.png`}
          alt="Logo da moeda"
          className={styles.logo}
        />

        <h1>
          {coin?.name} | {coin?.symbol}
        </h1>

        <p>
          <strong>• Preço: </strong>
          {coin?.formatedPrice}
        </p>

        <a>
          <strong>• Mercado: </strong>
          {coin?.formatedMarket}
        </a>

        <a>
          <strong>• Volume: </strong>
          {coin?.formatedVolume}
        </a>

        <a>
          <strong>• Mudança 24h: : </strong>
          <span
            className={
              Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss
            }
          >
            {Number(coin?.changePercent24Hr).toFixed(3)}
          </span>
        </a>
      </section>
    </div>
  );
};

export default Detail;
