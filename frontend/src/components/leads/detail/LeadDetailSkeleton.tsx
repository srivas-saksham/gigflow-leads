// components/leads/detail/LeadDetailSkeleton.tsx

const Bone = ({ w, h = 'h-3' }: { w: string; h?: string }) => (
  <div
    className={`${h} ${w} rounded-md animate-pulse`}
    style={{ background: 'var(--bg-raised)' }}
  />
);

export const LeadDetailSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-6">
      <Bone w="w-24" />
      <Bone w="w-1 h-1 rounded-full" />
      <Bone w="w-16" />
      <Bone w="w-1 h-1 rounded-full" />
      <Bone w="w-32" />
    </div>

    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Bone w="w-11" h="h-11" />
        <div className="space-y-2">
          <Bone w="w-40" h="h-5" />
          <Bone w="w-56" />
        </div>
      </div>
      <div className="flex gap-2">
        <Bone w="w-8" h="h-8" />
        <Bone w="w-16" h="h-8" />
        <Bone w="w-20" h="h-8" />
      </div>
    </div>

    {/* Divider + fields */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
      <div className="md:col-span-2 space-y-5">
        <Bone w="w-28" />
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className="flex items-center gap-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <Bone w="w-3.5" h="h-3.5" />
            <Bone w="w-20" />
            <Bone w="w-40" />
          </div>
        ))}
      </div>
      <div className="space-y-8">
        {[1,2,3].map(i => (
          <div key={i} className="space-y-3">
            <Bone w="w-24" />
            <Bone w="w-full" h="h-4" />
            <Bone w="w-3/4" />
            <Bone w="w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);