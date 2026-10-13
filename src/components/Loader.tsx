export default function Loader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-bg">
      <div className="loadingspinner">
        <div id="square1" />
        <div id="square2" />
        <div id="square3" />
        <div id="square4" />
        <div id="square5" />
      </div>
    </div>
  );
}