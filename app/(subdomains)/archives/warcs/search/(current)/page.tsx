import styles from "./page.module.css"
import { Suspense } from "react";
import WarcList from "./list";
import Overlay from "@/components/overlay";
import { getRandomDarkPastelColor } from "./actions";
import SearchForm from "./search";

type SearchParams = {
  [key: string]: string | undefined;
};

export default async function WarcSearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const uri = searchParams.uri || "";
  const pageStr = searchParams.page || "1";
  const totalStr = searchParams.total || "32";
  const type = searchParams.type || "";

  // Function to safely parse integers with a fallback
  const safeParseInt = (value: string, fallback: number = 0) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  // Safely parse page and total values
  const page = safeParseInt(pageStr, 1);
  const total = safeParseInt(totalStr, 32);

  return (
    <main style={{ width: "80%", margin: "0 auto" }}>
      <SearchForm
        uri={uri}
        page={page}
        total={total}
        type={type}
        pageVisible={true}
        totalVisible={true}
      />

      <Suspense key={uri+pageStr+totalStr+type} fallback={
        <div className={styles.results}>
          <div style={{ position: 'relative', width: "100%", aspectRatio: 1920 / 500, padding: 16 }}>
            <Overlay button={false} backgroundColor={getRandomDarkPastelColor()}>
              <h3 style={{ width: "75%", textAlign: 'center' }}>Loading the results, please wait a second...</h3>
            </Overlay>
          </div>
        </div>}>
        <WarcList
          uri={uri}
          page={page}
          total={total} type={type} />
      </Suspense>

    </main>
  );
}
