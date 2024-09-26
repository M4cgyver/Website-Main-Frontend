import Overlay from "@/components/overlay";

export default function ArchivesDefaultLoadingPage ({}) {
    return <div style={{ position: "relative", width: "100%", aspectRatio: "3000/1080" }}>
    <Overlay header={"Loading..."} button={false} backgroundColor="#00000000">
    </Overlay>
</div>
}