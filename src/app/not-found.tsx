import RightColumnLayout from "components/layouts/RightColumnLayout";

import "./not_found.css";
import Link from "components/Link";


export default function NotFoundPage() {

  return (
    <div data-theme="abyss" className="bg-base-200 min-h-screen">
      <RightColumnLayout className="bg-base-100 h-screen pt-10 flex flex-col">
        <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
        <div className="divider" />
        <div className="Dialogue__Content text-lg h-auto leading-snug flex-auto overflow-y-auto">
          <p>
            Instictively, you know you are not supposed to be here.
          </p>
          <p>
            Just a moment ago, you were browsing the web when you fell down here, the graveyard of ideas. This is a place between places, a crack through the crystal screen. Something may have been here once. And someday, something may return to fill the gap.</p>
          <p>
            But not today.
          </p>
          <p>
            For now, you must—
          </p>
          <div className="w-full flex flex-col justify-items-center">
            <Link href="/" className="self-center">
              <button className="btn btn-primary">
                RETURN TO SAFETY.
              </button>
            </Link>
          </div>
        </div>
      </RightColumnLayout>
    </div>
  )
}