import { BiathlonAPI } from '@/lib/api/biathlon-api'
import Link from 'next/link'
import Script from 'next/script'
import LiveTicker from '@/components/LiveTicker'
import StatsGrid from '@/components/StatsGrid'
import MarketTable from '@/components/MarketTable'
import LiveTimestamp from '@/components/LiveTimestamp'
import { SharePageButton } from '@/components/SharePageButton'
import WorldCupRankings from '@/components/WorldCupRankings'
import packageJson from '@/package.json'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const events = await BiathlonAPI.getEvents()

  // Find the currently active World Cup stage
  // A stage is active until the end of the day of its EndDate
  const now = new Date()
  const activeEvent = events.find(event => {
    const start = new Date(event.StartDate)
    // Set end time to end of day (23:59:59)
    const end = new Date(event.EndDate)
    end.setHours(23, 59, 59, 999)
    return now >= start && now <= end
  })

  // Get competitions only for the active event
  let competitions: any[] = []
  let nextEvent = null

  if (activeEvent) {
    // Fetch races for the active stage only
    const comps = await BiathlonAPI.getCompetitions(activeEvent.EventId)
    competitions = comps.map(comp => ({
      ...comp,
      eventName: activeEvent.Description,
      eventId: activeEvent.EventId,
      eventLocation: activeEvent.ShortDescription
    }))
  } else {
    // No active event, find the next upcoming event
    nextEvent = events
      .filter(event => {
        const start = new Date(event.StartDate)
        return start > now
      })
      .sort((a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime())[0]
  }

  const seasonEnded = !activeEvent && !nextEvent

  // Calculate statistics
  const totalEvents = events.length
  const liveEventsCount = activeEvent ? 1 : 0
  const totalCompetitions = competitions.length
  const liveCompetitions = competitions.filter(comp => {
    const status = BiathlonAPI.getRaceStatus(comp.StartTime)
    return status === 'live'
  }).length

  if (seasonEnded) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono">
        <div className="border-b border-green-500/30 bg-black/40 backdrop-blur">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 tracking-wider">
              BIATHLON LIVE MONITORING
            </h1>
            <p className="text-xs text-gray-500 mt-1">REAL-TIME DATA FEED • IBU OFFICIAL SOURCE</p>
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-block border border-green-500/30 bg-black/40 px-6 py-8">
            <p className="text-green-400 text-sm tracking-widest mb-3">SEASON STATUS</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              La saison est terminée
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Merci d'avoir suivi la saison avec nous. Le tableau de bord reviendra dès l'ouverture de la prochaine étape.
            </p>
            <div
              className="mt-8 flex justify-center"
              dangerouslySetInnerHTML={{
                __html: `
<style type="text/css">@import url("https://assets.mlcdn.com/fonts.css?version=1773928");</style>
<style type="text/css">
.ml-form-embedSubmitLoad { display: inline-block; width: 20px; height: 20px; }
.g-recaptcha { transform: scale(1); -webkit-transform: scale(1); transform-origin: 0 0; -webkit-transform-origin: 0 0; height: ; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: 0; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
.ml-form-embedSubmitLoad:after { content: " "; display: block; width: 11px; height: 11px; margin: 1px; border-radius: 50%; border: 4px solid #fff; border-color: #ffffff #ffffff #ffffff transparent; animation: ml-form-embedSubmitLoad 1.2s linear infinite; }
@keyframes ml-form-embedSubmitLoad { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
#mlb2-38851188.ml-form-embedContainer { box-sizing: border-box; display: table; margin: 0 auto; position: static; width: 100% !important; }
#mlb2-38851188.ml-form-embedContainer h4,
#mlb2-38851188.ml-form-embedContainer p,
#mlb2-38851188.ml-form-embedContainer span,
#mlb2-38851188.ml-form-embedContainer button { text-transform: none !important; letter-spacing: normal !important; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper { background-color: #f6f6f6; border-width: 0px; border-color: transparent; border-radius: 4px; border-style: solid; box-sizing: border-box; display: inline-block !important; margin: 0; padding: 0; position: relative; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper.embedPopup,
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper.embedDefault { width: 400px; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper.embedForm { max-width: 400px; width: 100%; }
#mlb2-38851188.ml-form-embedContainer .ml-form-align-left { text-align: left; }
#mlb2-38851188.ml-form-embedContainer .ml-form-align-center { text-align: center; }
#mlb2-38851188.ml-form-embedContainer .ml-form-align-default { display: table-cell !important; vertical-align: middle !important; text-align: center !important; }
#mlb2-38851188.ml-form-embedContainer .ml-form-align-right { text-align: right; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody,
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody { padding: 20px 20px 0 20px; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent,
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent { text-align: left; margin: 0 0 20px 0; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent h4,
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent h4 { color: #000000; font-family: 'Open Sans', Arial, Helvetica, sans-serif; font-size: 30px; font-weight: 400; margin: 0 0 10px 0; text-align: left; word-break: break-word; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p,
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p { color: #000000; font-family: 'Open Sans', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; line-height: 20px; margin: 0 0 10px 0; text-align: left; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody form { margin: 0; width: 100%; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent { margin: 0 0 20px 0; width: 100%; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow { margin: 0 0 10px 0; width: 100%; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow.ml-last-item { margin: 0; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input { background-color: #ffffff !important; color: #333333 !important; border-color: #cccccc; border-radius: 4px !important; border-style: solid !important; border-width: 1px !important; font-family: 'Open Sans', Arial, Helvetica, sans-serif; font-size: 14px !important; height: auto; line-height: 21px !important; margin-bottom: 0; margin-top: 0; margin-left: 0; margin-right: 0; padding: 10px 10px !important; width: 100% !important; box-sizing: border-box !important; max-width: 100% !important; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit { margin: 0 0 20px 0; float: left; width: 100%; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button { background-color: #000000 !important; border: none !important; border-radius: 4px !important; box-shadow: none !important; color: #ffffff !important; cursor: pointer; font-family: 'Open Sans', Arial, Helvetica, sans-serif !important; font-size: 14px !important; font-weight: 700 !important; line-height: 21px !important; height: auto; padding: 10px !important; width: 100% !important; box-sizing: border-box !important; }
#mlb2-38851188.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button:hover { background-color: #333333 !important; }
@media only screen and (max-width: 400px){
  .ml-form-embedWrapper.embedDefault, .ml-form-embedWrapper.embedPopup { width: 100%!important; }
}
</style>
<div id="mlb2-38851188" class="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-38851188">
  <div class="ml-form-align-center ">
    <div class="ml-form-embedWrapper embedForm">
      <div class="ml-form-embedBody ml-form-embedBodyDefault row-form">
        <div class="ml-form-embedContent" style="margin-bottom: 0px;"></div>
        <form class="ml-block-form" action="https://assets.mailerlite.com/jsonp/712166/forms/182728272266659663/subscribe" data-code="" method="post" target="_blank">
          <div class="ml-form-formContent">
            <div class="ml-form-fieldRow ml-last-item">
              <div class="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                <input aria-label="email" aria-required="true" type="email" class="form-control" data-inputmask="" name="fields[email]" placeholder="Email" autocomplete="email">
              </div>
            </div>
          </div>
          <input type="hidden" name="ml-submit" value="1">
          <div class="ml-form-embedSubmit">
            <button type="submit" class="primary">Subscribe</button>
            <button disabled="disabled" style="display: none;" type="button" class="loading">
              <div class="ml-form-embedSubmitLoad"></div>
              <span class="sr-only">Loading...</span>
            </button>
          </div>
          <input type="hidden" name="anticsrf" value="true">
        </form>
      </div>
      <div class="ml-form-successBody row-success" style="display: none">
        <div class="ml-form-successContent">
          <h4>Thank you!</h4>
          <p>You have successfully joined our subscriber list.</p>
        </div>
      </div>
    </div>
  </div>
</div>
`,
              }}
            />
          </div>
        </div>

        <Script
          src="https://groot.mailerlite.com/js/w/webforms.min.js?v95037e5bac78f29ed026832ca21a7c7b"
          strategy="afterInteractive"
        />
        <Script
          id="ml-form-inline"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
function ml_webform_success_38851188() {
  var $ = ml_jQuery || jQuery;
  $('.ml-subscribe-form-38851188 .row-success').show();
  $('.ml-subscribe-form-38851188 .row-form').hide();
}
fetch("https://assets.mailerlite.com/jsonp/712166/forms/182728272266659663/takel")
`,
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono">

        <div className="border-t border-green-500/30 bg-black/40">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-500 text-xs space-y-1">
              <p>DATA SOURCE: BIATHLONRESULTS.COM • UPDATE FREQUENCY: 30s</p>
              <p>© 2026 BIATHLON MONITORING SYSTEM • ALL RIGHTS RESERVED</p>
              <p>DEVELOPED BY <a href="https://lamouche.fr" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline">BENOIT</a></p>
              <p>VERSION {packageJson.version}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono">
      {/* Header terminal style */}
      <div className="border-b border-green-500/30 bg-black/40 backdrop-blur">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 tracking-wider">
                BIATHLON LIVE MONITORING
              </h1>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                REAL-TIME DATA FEED • IBU OFFICIAL SOURCE • <LiveTimestamp />
              </p>
            </div>
            <div className="flex gap-2 self-end md:self-auto">
              <SharePageButton />
              <div className="px-3 md:px-4 py-1.5 md:py-2 border border-green-500/50 bg-green-500/5">
                <span className="text-green-400 animate-pulse text-xs md:text-sm">● LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <LiveTicker competitions={competitions} locale={locale} />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <StatsGrid
          totalEvents={totalEvents}
          liveEvents={liveEventsCount}
          totalCompetitions={totalCompetitions}
          liveCompetitions={liveCompetitions}
        />

        {/* Market Table - Courses actives */}
        <MarketTable
          competitions={competitions}
          locale={locale}
          nextEvent={nextEvent}
        />

        {/* World Cup Rankings */}
        <WorldCupRankings locale={locale} />

        {/* All Events Grid */}
        <div className="mt-8">
          <div className="border border-cyan-500/30 bg-black/40 p-3 md:p-4 mb-4">
            <h2 className="text-cyan-400 text-base md:text-lg font-bold tracking-wider">
              [EVENT REGISTRY]
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {events.map((event, index) => {
              const now = new Date()
              const start = new Date(event.StartDate)
              const end = new Date(event.EndDate)
              const isLive = now >= start && now <= end
              const isUpcoming = now < start

              return (
                <Link
                  key={event.EventId}
                  href={`/${locale}/event/${event.EventId}`}
                  className="block border border-gray-700/50 bg-black/20 hover:border-green-500/50 hover:bg-green-500/5 transition-all"
                >
                  {/* Mobile Layout */}
                  <div className="p-3 font-mono text-sm md:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">#{String(index + 1).padStart(3, '0')}</span>
                        {isLive ? (
                          <span className="text-green-400 animate-pulse text-lg">●</span>
                        ) : isUpcoming ? (
                          <span className="text-yellow-400">○</span>
                        ) : (
                          <span className="text-gray-600">○</span>
                        )}
                      </div>
                      {isLive ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/50 text-xs">
                          LIVE
                        </span>
                      ) : isUpcoming ? (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-xs">
                          UPCOMING
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-700/20 text-gray-500 border border-gray-700/50 text-xs">
                          CLOSED
                        </span>
                      )}
                    </div>
                    <div className="text-white font-bold mb-1">{event.Description}</div>
                    <div className="text-gray-400 text-xs mb-1">{event.ShortDescription}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{event.Organizer}</span>
                      <span className="text-gray-400">
                        {new Date(event.StartDate).toLocaleDateString(locale)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block p-4">
                    <div className="grid grid-cols-12 gap-4 items-center text-sm">
                      <div className="col-span-1 text-gray-500 text-right">
                        #{String(index + 1).padStart(3, '0')}
                      </div>

                      <div className="col-span-1">
                        {isLive ? (
                          <span className="text-green-400 animate-pulse text-lg">●</span>
                        ) : isUpcoming ? (
                          <span className="text-yellow-400">○</span>
                        ) : (
                          <span className="text-gray-600">○</span>
                        )}
                      </div>

                      <div className="col-span-4">
                        <div className="text-white font-bold">{event.Description}</div>
                        <div className="text-gray-500 text-xs">{event.Organizer}</div>
                      </div>

                      <div className="col-span-2 text-gray-400">
                        {event.ShortDescription}
                      </div>

                      <div className="col-span-2 text-gray-400">
                        {new Date(event.StartDate).toLocaleDateString(locale)}
                      </div>

                      <div className="col-span-2 text-right">
                        {isLive ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 text-xs">
                            LIVE
                          </span>
                        ) : isUpcoming ? (
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-xs">
                            UPCOMING
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-700/20 text-gray-500 border border-gray-700/50 text-xs">
                            CLOSED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-green-500/30 bg-black/40 mt-12">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-xs space-y-1">
            <p>DATA SOURCE: BIATHLONRESULTS.COM • UPDATE FREQUENCY: 30s</p>
            <p>© 2026 BIATHLON MONITORING SYSTEM • ALL RIGHTS RESERVED</p>
            <p>DEVELOPED BY <a href="https://lamouche.fr" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline">BENOIT</a></p>
            <p>VERSION {packageJson.version}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
