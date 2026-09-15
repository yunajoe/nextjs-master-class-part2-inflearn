interface InstanceDetail {
  id: string;
  status: string;
  cpuUsage: number;
  description: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

async function page({ params }: Props) {
  const { id } = await params;
  const response = await fetch(`http://localhost:3000/api/instances/${id}`, {
    cache: "no-store",
  });
  const instance: InstanceDetail = await response.json();
  return (
    <div className="p-6 border border-gray-300 rounded-lg max-w-md mt-8">
      <h1 className="text-2xl font-bold mb-4">☁️ 클라우드 인스턴스 제어소</h1>
      <hr className="mb-4" />
      <p className="mb-2">
        <strong>타겟 식별자:</strong> {instance.id}
      </p>
      <p className="mb-2">
        <strong>현재 상태:</strong> 🟢 {instance.status}
      </p>
      <p className="mb-2">
        <strong>CPU 점유율:</strong> {instance.cpuUsage}%
      </p>
      <p className="mb-4 text-sm text-gray-600">
        <strong>시스템 로그:</strong> {instance.description}
      </p>
      <p className="text-xs text-gray-400">요청된 타겟 ID: {id}</p>
    </div>
  );
}

export default page;
