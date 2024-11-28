import dynamic from "next/dynamic"

const DetailDestination = dynamic(() => import("../../components/PlaceDetail"), { ssr:false })

export default function inicio() {

return(
 <>
  <DetailDestination />
 </>
 )
}
