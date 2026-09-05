import {
  getGuideConversion,
  type GuideConversionContext,
  type GuideCtaPlacement,
} from '@/lib/guide-conversion';
import { EnquiryActions } from './EnquiryActions';
import { EnquiryProof } from './EnquiryProof';
import { GroundProvider } from './Ground';

export interface GuideEnquiryCalloutProps {
  context: GuideConversionContext;
  placement: Exclude<GuideCtaPlacement, 'sticky'>;
}
export function GuideEnquiryCallout({ context, placement }: GuideEnquiryCalloutProps): JSX.Element {
  const config = getGuideConversion(context.guideSlug, context.category, context.title);
  return (
    <GroundProvider value="light">
      <aside
        aria-label="Talk to Peter about this guide"
        data-guide-enquiry={placement}
        className="my-9 rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 text-oj-ink"
      >
        <h2 className="font-oj text-[23px] font-black leading-tight">{config.heading}</h2>
        <p className="mt-3 leading-relaxed">{config.body}</p>
        <EnquiryActions context={context} placement={placement} />
        {placement === 'end' ? <EnquiryProof proof={config.proof} /> : null}
      </aside>
    </GroundProvider>
  );
}
