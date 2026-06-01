#!/usr/bin/env bash
set -e

echo "========================================="
echo "  CodeMate 智学工坊 — 启动脚本"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# ----- Backend -----
echo -e "${BLUE}[1/4] 安装后端依赖...${NC}"
cd backend
pip install -r requirements.txt -q
echo -e "${GREEN}  ✓ 后端依赖安装完成${NC}"

echo -e "${BLUE}[2/4] 启动后端 (uvicorn)...${NC}"
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}  ✓ 后端已启动 (PID: $BACKEND_PID, http://localhost:8000)${NC}"

# ----- Frontend -----
echo -e "${BLUE}[3/4] 安装前端依赖...${NC}"
cd ../frontend
npm install --silent
echo -e "${GREEN}  ✓ 前端依赖安装完成${NC}"

echo -e "${BLUE}[4/4] 启动前端 (Vite)...${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}  ✓ 前端已启动 (PID: $FRONTEND_PID, http://localhost:5173)${NC}"

echo ""
echo "========================================="
echo -e "  ${GREEN}CodeMate 智学工坊 启动完成!${NC}"
echo ""
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:8000"
echo "  API 文档: http://localhost:8000/docs"
echo ""
echo "  按 Ctrl+C 停止所有服务"
echo "========================================="

# Trap to kill both on exit
trap "echo '正在停止...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait
